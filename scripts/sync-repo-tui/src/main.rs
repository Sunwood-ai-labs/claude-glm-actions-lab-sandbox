//! GitHub リポジトリ同期ツール TUI
//! Secrets、Workflows、Agents を同期

use ratatui::{
    crossterm::{
        event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode, KeyEvent},
        execute,
        terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
    },
    prelude::*,
    style::{Style, Stylize},
    widgets::{Block, Borders, List, ListItem, ListState, Paragraph, Wrap},
};
use std::{
    env,
    io::{self},
    process::Command,
    time::Duration,
};

/// リポジトリ情報
#[derive(Debug, Clone)]
struct Repository {
    /// オーナー/リポジトリ名
    full_name: String,
    /// リポジトリ名
    _name: String,
    /// 更新日時
    _updated_at: String,
    /// 説明
    description: Option<String>,
}

/// アプリケーションの状態
struct App {
    /// 現在の画面
    screen: Screen,
    /// 同期モードの選択インデックス
    mode_selection: usize,
    /// 同期項目の選択状態
    sync_secrets: bool,
    sync_workflows: bool,
    sync_agents: bool,
    /// 項目選択のインデックス
    item_selection: usize,
    /// ターゲットリポジトリ
    target_repo: String,
    /// ターゲット組織
    target_org: String,
    /// .env が存在するか
    env_exists: bool,
    /// 警告メッセージ
    warning: Option<String>,
    /// 終了フラグ
    should_quit: bool,
    /// リポジトリ一覧
    repositories: Vec<Repository>,
    /// リポジトリ選択状態
    repo_list_state: ListState,
    /// 手動入力モード
    manual_input_mode: bool,
    /// 手動入力バッファ
    input_buffer: String,
}

/// 画面の種類
enum Screen {
    /// 同期モード選択画面
    ModeSelection,
    /// リポジトリ選択画面
    RepositorySelection,
    /// 同期項目選択画面
    ItemSelection,
    /// 確認画面
    Confirmation,
    /// 実行中画面
    Running,
    /// 完了画面
    Complete,
}

impl App {
    fn new() -> Self {
        // .env ファイルのチェック
        let project_root = env::var("PROJECT_ROOT").unwrap_or_else(|_| ".".to_string());
        let env_path = format!("{}/.env", project_root);
        let env_exists = std::path::Path::new(&env_path).exists();

        let mut repo_list_state = ListState::default();
        repo_list_state.select(Some(0));

        App {
            screen: Screen::ModeSelection,
            mode_selection: 0,
            sync_secrets: false,
            sync_workflows: true,
            sync_agents: true,
            item_selection: 0,
            target_repo: env::var("TARGET_REPO").unwrap_or_else(|_| "Sunwood-ai-labs/claude-glm-actions-lab-sandbox".to_string()),
            target_org: env::var("TARGET_ORG").unwrap_or_else(|_| "Sunwood-ai-labs".to_string()),
            env_exists,
            warning: None,
            should_quit: false,
            repositories: Vec::new(),
            repo_list_state,
            manual_input_mode: false,
            input_buffer: String::new(),
        }
    }

    /// ユーザーのリポジトリ一覧を取得（最新順）
    fn fetch_repositories(&mut self) {
        self.repositories.clear();

        // gh コマンドでリポジトリ一覧を取得（更新日順、最新30件）
        let output = Command::new("gh")
            .args(["repo", "list", "--limit", "30", "--json", "name,owner,updatedAt,description"])
            .output();

        if let Ok(output) = output {
            if output.status.success() {
                let json = String::from_utf8_lossy(&output.stdout);
                if let Ok(data) = serde_json::from_str::<serde_json::Value>(&json) {
                    if let Some(repos) = data.as_array() {
                        for repo in repos {
                            if let (Some(owner), Some(name), Some(updated)) = (
                                repo["owner"].get("login").and_then(|v| v.as_str()),
                                repo.get("name").and_then(|v| v.as_str()),
                                repo.get("updatedAt").and_then(|v| v.as_str()),
                            ) {
                                let full_name = format!("{}/{}", owner, name);
                                let description = repo.get("description").and_then(|v| v.as_str()).map(|s| s.to_string());

                                self.repositories.push(Repository {
                                    full_name,
                                    _name: name.to_string(),
                                    _updated_at: updated.to_string(),
                                    description,
                                });
                            }
                        }
                    }
                }
            }
        }

        // 空の場合はデフォルトを追加
        if self.repositories.is_empty() {
            self.repositories.push(Repository {
                full_name: self.target_repo.clone(),
                _name: self.target_repo.split('/').last().unwrap_or(&self.target_repo).to_string(),
                _updated_at: String::new(),
                description: None,
            });
        }

        // 先頭を選択
        self.repo_list_state.select(Some(0));
    }

    /// キー入力を処理
    fn handle_key(&mut self, key: KeyEvent) {
        match &self.screen {
            Screen::ModeSelection => match key.code {
                KeyCode::Up => {
                    if self.mode_selection > 0 {
                        self.mode_selection -= 1;
                    }
                }
                KeyCode::Down => {
                    if self.mode_selection < 1 {
                        self.mode_selection += 1;
                    }
                }
                KeyCode::Enter => {
                    if self.mode_selection == 0 {
                        // 単一リポジトリモード
                        self.fetch_repositories();
                        self.screen = Screen::RepositorySelection;
                    } else {
                        // 組織モードはそのまま項目選択へ
                        self.screen = Screen::ItemSelection;
                        self.item_selection = 0;
                    }
                    self.warning = None;
                }
                KeyCode::Char('q') => self.should_quit = true,
                _ => {}
            },
            Screen::RepositorySelection => {
                if self.manual_input_mode {
                    match key.code {
                        KeyCode::Enter => {
                            if !self.input_buffer.is_empty() {
                                self.target_repo = self.input_buffer.clone();
                                self.manual_input_mode = false;
                                self.input_buffer.clear();
                                self.screen = Screen::ItemSelection;
                                self.item_selection = 0;
                            }
                        }
                        KeyCode::Esc => {
                            self.manual_input_mode = false;
                            self.input_buffer.clear();
                        }
                        KeyCode::Char(c) => {
                            self.input_buffer.push(c);
                        }
                        KeyCode::Backspace => {
                            self.input_buffer.pop();
                        }
                        _ => {}
                    }
                } else {
                    match key.code {
                        KeyCode::Up => {
                            if let Some(selected) = self.repo_list_state.selected() {
                                if selected > 0 {
                                    self.repo_list_state.select(Some(selected - 1));
                                }
                            }
                        }
                        KeyCode::Down => {
                            if let Some(selected) = self.repo_list_state.selected() {
                                if selected + 1 < self.repositories.len() {
                                    self.repo_list_state.select(Some(selected + 1));
                                }
                            }
                        }
                        KeyCode::Enter => {
                            if let Some(selected) = self.repo_list_state.selected() {
                                if let Some(repo) = self.repositories.get(selected) {
                                    self.target_repo = repo.full_name.clone();
                                    self.screen = Screen::ItemSelection;
                                    self.item_selection = 0;
                                }
                            }
                        }
                        KeyCode::Char('i') => {
                            self.manual_input_mode = true;
                            self.input_buffer = self.target_repo.clone();
                        }
                        KeyCode::Char('q') | KeyCode::Esc => {
                            self.screen = Screen::ModeSelection;
                        }
                        _ => {}
                    }
                }
            }
            Screen::ItemSelection => match key.code {
                KeyCode::Up => {
                    if self.item_selection > 0 {
                        self.item_selection -= 1;
                    }
                }
                KeyCode::Down => {
                    if self.item_selection < 3 {
                        self.item_selection += 1;
                    }
                }
                KeyCode::Enter => {
                    if self.item_selection == 3 {
                        // 続行ボタン
                        // Secrets を ON にしていて .env がない場合は警告
                        if self.sync_secrets && !self.env_exists {
                            self.warning = Some(".env が見つかりません。Secrets はスキップされます".to_string());
                        }
                        self.screen = Screen::Confirmation;
                    } else {
                        // ON/OFF 切り替え
                        match self.item_selection {
                            0 => {
                                // Secrets を ON にしようとして .env がない場合は警告
                                if !self.sync_secrets && !self.env_exists {
                                    self.warning = Some(".env が見つかりません。Secrets を同期するには .env が必要です".to_string());
                                } else {
                                    self.warning = None;
                                }
                                self.sync_secrets = !self.sync_secrets;
                            }
                            1 => {
                                self.sync_workflows = !self.sync_workflows;
                                self.warning = None;
                            }
                            2 => {
                                self.sync_agents = !self.sync_agents;
                                self.warning = None;
                            }
                            _ => {}
                        }
                    }
                }
                KeyCode::Char(' ') => {
                    if self.item_selection < 3 {
                        match self.item_selection {
                            0 => {
                                if !self.sync_secrets && !self.env_exists {
                                    self.warning = Some(".env が見つかりません。Secrets を同期するには .env が必要です".to_string());
                                } else {
                                    self.warning = None;
                                }
                                self.sync_secrets = !self.sync_secrets;
                            }
                            1 => {
                                self.sync_workflows = !self.sync_workflows;
                                self.warning = None;
                            }
                            2 => {
                                self.sync_agents = !self.sync_agents;
                                self.warning = None;
                            }
                            _ => {}
                        }
                    }
                }
                KeyCode::Char('q') => {
                    if self.mode_selection == 0 {
                        self.screen = Screen::RepositorySelection;
                    } else {
                        self.screen = Screen::ModeSelection;
                    }
                    self.warning = None;
                }
                _ => {}
            },
            Screen::Confirmation => match key.code {
                KeyCode::Enter | KeyCode::Char('y') | KeyCode::Char('Y') => {
                    // Secrets が ON で .env がない場合は OFF にする
                    if self.sync_secrets && !self.env_exists {
                        self.sync_secrets = false;
                    }
                    self.screen = Screen::Running;
                }
                KeyCode::Char('n') | KeyCode::Char('N') | KeyCode::Char('q') => {
                    self.screen = Screen::ItemSelection;
                }
                _ => {}
            },
            Screen::Running => {
                // 実行中は何もしない
            }
            Screen::Complete => {
                self.should_quit = true;
            }
        }
    }

    /// 同期を実行
    fn run_sync(&mut self) {
        let script_dir = env::var("SCRIPT_DIR").unwrap_or_else(|_| "./scripts".to_string());

        let mut commands = Vec::new();

        if self.sync_secrets {
            commands.push("sync-secrets.sh");
        }
        if self.sync_workflows {
            commands.push("sync-workflows.sh");
        }
        if self.sync_agents {
            commands.push("sync-agents.sh");
        }

        for script in commands {
            let script_path = format!("{}/{}", script_dir, script);
            let _ = Command::new("bash")
                .arg(&script_path)
                .status();
        }

        self.screen = Screen::Complete;
    }
}

/// ターミナル UI の実行
fn run_terminal<B: Backend>(terminal: &mut Terminal<B>, app: &mut App) -> io::Result<()> {
    loop {
        // 描画
        terminal.draw(|f| render_app(f, app))?;

        // イベント処理
        if !matches!(app.screen, Screen::Running) {
            if event::poll(Duration::from_millis(100))? {
                if let Event::Key(key) = event::read()? {
                    app.handle_key(key);
                }
            }
        }

        // 終了チェック
        if app.should_quit {
            return Ok(());
        }

        // 実行画面なら同期を実行
        if matches!(app.screen, Screen::Running) {
            app.run_sync();
        }
    }
}

/// 色定数
mod colors {
    use ratatui::style::Color;

    pub const CYAN: Color = Color::Cyan;
    pub const GREEN: Color = Color::Green;
    pub const YELLOW: Color = Color::Yellow;
    pub const RED: Color = Color::Red;
    pub const BLUE: Color = Color::Blue;
    pub const MAGENTA: Color = Color::Magenta;
    pub const WHITE: Color = Color::White;
    pub const GRAY: Color = Color::Rgb(100, 100, 100);
}

/// アプリケーションを描画
fn render_app(f: &mut Frame, app: &App) {
    let size = f.area();

    // カラフルなタイトル
    let title_spans = vec![
        Line::from("╔══════════════════════════════════════════════════════════════════════════╗".cyan()),
        Line::from("║                                                                            ║".cyan()),
        Line::from(vec![
            "║   ".cyan(),
            "GitHub リポジトリ同期ツール".green().bold(),
            " (TUI)                                           ║".cyan(),
        ]),
        Line::from(vec![
            "║   ".cyan(),
            "Sync Secrets".magenta(),
            ", ".into(),
            "Workflows".blue(),
            ", and ".into(),
            "Agents".yellow(),
            "                                    ║".cyan(),
        ]),
        Line::from("║                                                                            ║".cyan()),
        Line::from("╚══════════════════════════════════════════════════════════════════════════╝".cyan()),
    ];

    let title = Paragraph::new(title_spans)
        .block(Block::default().borders(Borders::ALL).border_style(Style::default().fg(colors::CYAN)))
        .wrap(Wrap { trim: true });

    let title_height = 8;
    f.render_widget(title, Rect::new(0, 0, size.width, title_height));

    match &app.screen {
        Screen::ModeSelection => render_mode_selection(f, app, size, title_height),
        Screen::RepositorySelection => render_repository_selection(f, app, size, title_height),
        Screen::ItemSelection => render_item_selection(f, app, size, title_height),
        Screen::Confirmation => render_confirmation(f, app, size, title_height),
        Screen::Running => render_running(f, app, size, title_height),
        Screen::Complete => render_complete(f, app, size, title_height),
    }
}

/// 同期モード選択画面を描画
fn render_mode_selection(f: &mut Frame, app: &App, size: Rect, offset: u16) {
    let modes = vec!["単一リポジトリ", "組織内の全リポジトリ（除外リスト適用）"];

    let items: Vec<ListItem> = modes
        .iter()
        .enumerate()
        .map(|(i, mode)| {
            let prefix = if i == app.mode_selection { "→ " } else { "  " };
            let style = if i == app.mode_selection {
                Style::default().fg(colors::GREEN).bold()
            } else {
                Style::default().fg(colors::WHITE)
            };
            ListItem::new(format!("{}[{}] {}", prefix, i + 1, mode)).style(style)
        })
        .collect();

    let list = List::new(items)
        .block(Block::default().borders(Borders::ALL).title("同期モードを選択".cyan().bold()).border_style(Style::default().fg(colors::CYAN)));

    f.render_widget(
        list,
        Rect::new(4, offset + 2, size.width - 8, 8),
    );

    // ターゲット情報を表示
    let target_info = vec![
        Line::from(vec![
            "ターゲットリポジトリ: ".blue(),
            app.target_repo.as_str().yellow(),
        ]),
        Line::from(vec![
            "ターゲット組織: ".blue(),
            app.target_org.as_str().yellow(),
        ]),
    ];

    let info = Paragraph::new(target_info)
        .block(Block::default().borders(Borders::ALL).border_style(Style::default().fg(colors::GRAY)));
    f.render_widget(
        info,
        Rect::new(4, offset + 11, size.width - 8, 5),
    );

    // ヘルプ
    let help = Line::from(vec![
        "[↑/↓] ".cyan(),
        "選択  ".into(),
        "[Enter] ".green(),
        "決定  ".into(),
        "[q] ".red(),
        "終了".into(),
    ]);
    let help_paragraph = Paragraph::new(help);
    f.render_widget(
        help_paragraph,
        Rect::new(4, size.height - 3, size.width - 8, 3),
    );
}

/// リポジトリ選択画面を描画
fn render_repository_selection(f: &mut Frame, app: &App, size: Rect, offset: u16) {
    let items: Vec<ListItem> = app.repositories
        .iter()
        .enumerate()
        .map(|(i, repo)| {
            let is_selected = app.repo_list_state.selected() == Some(i);
            let prefix = if is_selected { "→ " } else { "  " };

            let style = if is_selected {
                Style::default().fg(colors::GREEN).bold()
            } else {
                Style::default().fg(colors::WHITE)
            };

            let mut text = format!("{}{}", prefix, repo.full_name);
            if let Some(desc) = &repo.description {
                if !desc.is_empty() {
                    text.push_str(&format!(" - {}", desc));
                }
            }

            ListItem::new(text).style(style)
        })
        .collect();

    let list = List::new(items)
        .block(Block::default().borders(Borders::ALL).title("リポジトリを選択".cyan().bold()).border_style(Style::default().fg(colors::CYAN)));

    let list_area = Rect::new(4, offset + 2, size.width - 8, size.height - offset - 8);
    f.render_stateful_widget(list, list_area, &mut app.repo_list_state.clone());

    // 手動入力モード
    if app.manual_input_mode {
        let input_text = Line::from(vec![
            "リポジトリを入力 (owner/repo): ".yellow(),
            app.input_buffer.as_str().green().bold(),
            "_".into(),
        ]);
        let input = Paragraph::new(input_text)
            .block(Block::default().borders(Borders::ALL).title("手動入力".magenta().bold()).border_style(Style::default().fg(colors::MAGENTA)));
        f.render_widget(
            input,
            Rect::new(6, offset + 12, size.width - 12, 3),
        );
    }

    // ヘルプ
    let help = Line::from(vec![
        "[↑/↓] ".cyan(),
        "選択  ".into(),
        "[Enter] ".green(),
        "決定  ".into(),
        "[i] ".magenta(),
        "手動入力  ".into(),
        "[q/Esc] ".red(),
        "戻る".into(),
    ]);
    let help_paragraph = Paragraph::new(help);
    f.render_widget(
        help_paragraph,
        Rect::new(4, size.height - 3, size.width - 8, 3),
    );
}

/// 同期項目選択画面を描画
fn render_item_selection(f: &mut Frame, app: &App, size: Rect, offset: u16) {
    let items = vec![
        ("Secrets", app.sync_secrets, colors::MAGENTA),
        ("Workflows", app.sync_workflows, colors::BLUE),
        ("Agents", app.sync_agents, colors::YELLOW),
    ];

    let mut text_lines: Vec<Line> = items
        .iter()
        .enumerate()
        .map(|(i, (name, enabled, color))| {
            let prefix = if i == app.item_selection { "→ " } else { "  " };
            let status_color = if *enabled { colors::GREEN } else { colors::RED };
            let status = if *enabled { "ON" } else { "OFF" };

            let mut spans = vec![
                Span::styled(prefix, Style::default().fg(colors::CYAN)),
                Span::styled(format!("[{}] ", i + 1), Style::default().fg(colors::GRAY)),
                Span::styled(*name, Style::default().fg(*color).bold()),
                Span::styled(" : ", Style::default()),
                Span::styled(status, Style::default().fg(status_color).bold()),
            ];

            // Secrets で .env がない場合は警告マーク
            if *name == "Secrets" && !app.env_exists {
                spans.push(Span::styled(
                    " ⚠ (.envなし)",
                    Style::default().fg(colors::YELLOW),
                ));
            }

            Line::from(spans)
        })
        .collect();

    // 続行ボタン
    let continue_style = if app.item_selection == 3 {
        Style::default().fg(colors::GREEN).bold()
    } else {
        Style::default().fg(colors::GRAY)
    };
    text_lines.push(Line::from(vec![
        Span::styled(if app.item_selection == 3 { "→ " } else { "  " }, Style::default()),
        Span::styled("[4] 続行", continue_style),
    ]));

    let paragraph = Paragraph::new(text_lines)
        .block(Block::default().borders(Borders::ALL).title("同期項目を選択".cyan().bold()).border_style(Style::default().fg(colors::CYAN)));

    f.render_widget(
        paragraph,
        Rect::new(4, offset + 2, size.width - 8, 10),
    );

    // 警告メッセージがあれば表示
    if let Some(warning) = &app.warning {
        let warning_text = Line::from(vec![
            "⚠ ".yellow(),
            warning.as_str().yellow().bold(),
        ]);
        let warning_paragraph = Paragraph::new(warning_text)
            .block(Block::default().borders(Borders::ALL).border_style(Style::default().fg(colors::YELLOW)));
        f.render_widget(
            warning_paragraph,
            Rect::new(6, offset + 13, size.width - 12, 3),
        );
    }

    // 選択中のリポジトリを表示
    let repo_info = Line::from(vec![
        "ターゲット: ".blue(),
        app.target_repo.as_str().green().bold(),
    ]);
    let repo_paragraph = Paragraph::new(repo_info);
    f.render_widget(
        repo_paragraph,
        Rect::new(4, offset + 17, size.width - 8, 3),
    );

    // ヘルプ
    let help = Line::from(vec![
        "[↑/↓] ".cyan(),
        "選択  ".into(),
        "[Space] ".yellow(),
        "切替  ".into(),
        "[Enter] ".green(),
        "決定  ".into(),
        "[q] ".red(),
        "戻る".into(),
    ]);
    let help_paragraph = Paragraph::new(help);
    f.render_widget(
        help_paragraph,
        Rect::new(4, size.height - 3, size.width - 8, 3),
    );
}

/// 確認画面を描画
fn render_confirmation(f: &mut Frame, app: &App, size: Rect, offset: u16) {
    let mode_str = if app.mode_selection == 0 {
        "単一リポジトリ"
    } else {
        "組織内の全リポジトリ"
    };

    let mut items: Vec<Line> = Vec::new();
    if app.sync_secrets {
        items.push(Line::from("  ✓ Secrets".magenta()));
    }
    if app.sync_workflows {
        items.push(Line::from("  ✓ Workflows".blue()));
    }
    if app.sync_agents {
        items.push(Line::from("  ✓ Agents".yellow()));
    }

    let mut all_lines: Vec<Line> = vec![
        Line::from(""),
        Line::from(vec![
            "同期モード: ".cyan(),
            mode_str.white().bold(),
        ]),
        Line::from(""),
        Line::from(vec![
            "ターゲット: ".cyan(),
            app.target_repo.as_str().green().bold(),
        ]),
        Line::from(""),
        Line::from("選択された同期項目:".cyan()),
    ];
    all_lines.extend(items);
    all_lines.push(Line::from(""));
    all_lines.push(Line::from("よろしいですか？".white()));

    let paragraph = Paragraph::new(all_lines)
        .block(Block::default().borders(Borders::ALL).title("確認".cyan().bold()).border_style(Style::default().fg(colors::CYAN)));

    f.render_widget(
        paragraph,
        Rect::new(4, offset + 2, size.width - 8, 14),
    );

    // .env がないのに Secrets が ON の場合は警告
    if app.sync_secrets && !app.env_exists {
        let warning = Line::from(vec![
            "⚠ ".yellow(),
            ".env が見つからないため、Secrets はスキップされます".yellow().bold(),
        ]);
        let warning_paragraph = Paragraph::new(warning)
            .block(Block::default().borders(Borders::ALL).border_style(Style::default().fg(colors::YELLOW)));
        f.render_widget(
            warning_paragraph,
            Rect::new(6, offset + 17, size.width - 12, 3),
        );
    }

    // ヘルプ
    let help = Line::from(vec![
        "[Enter/Y] ".green(),
        "実行  ".into(),
        "[N] ".red(),
        "戻る".into(),
    ]);
    let help_paragraph = Paragraph::new(help);
    f.render_widget(
        help_paragraph,
        Rect::new(4, size.height - 3, size.width - 8, 3),
    );
}

/// 実行中画面を描画
fn render_running(f: &mut Frame, _app: &App, size: Rect, offset: u16) {
    let content = vec![
        Line::from(""),
        Line::from(""),
        Line::from("同期を実行中...".cyan().bold()),
        Line::from(""),
        Line::from(""),
        Line::from(vec![
            "お待ちください ".white(),
            "🔄".yellow(),
        ]),
    ];

    let paragraph = Paragraph::new(content)
        .block(Block::default().borders(Borders::ALL).title("実行中".yellow().bold()).border_style(Style::default().fg(colors::YELLOW)));

    f.render_widget(
        paragraph,
        Rect::new(4, offset + 2, size.width - 8, size.height - offset - 4),
    );
}

/// 完了画面を描画
fn render_complete(f: &mut Frame, _app: &App, size: Rect, offset: u16) {
    let content = vec![
        Line::from(""),
        Line::from(""),
        Line::from(vec![
            "✓ ".green(),
            "同期が完了しました！".green().bold(),
        ]),
        Line::from(""),
        Line::from(""),
        Line::from("何かキーを押して終了...".gray()),
    ];

    let paragraph = Paragraph::new(content)
        .block(Block::default().borders(Borders::ALL).title("完了".green().bold()).border_style(Style::default().fg(colors::GREEN)));

    f.render_widget(
        paragraph,
        Rect::new(4, offset + 2, size.width - 8, size.height - offset - 4),
    );
}

fn main() -> io::Result<()> {
    // ターミナルを初期化
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    // アプリケーションを作成
    let mut app = App::new();

    // メインループ
    let res = run_terminal(&mut terminal, &mut app);

    // 後始末
    disable_raw_mode()?;
    execute!(
        terminal.backend_mut(),
        LeaveAlternateScreen,
        DisableMouseCapture
    )?;
    terminal.show_cursor()?;

    if let Err(err) = res {
        eprintln!("{:?}", err);
    }

    Ok(())
}
