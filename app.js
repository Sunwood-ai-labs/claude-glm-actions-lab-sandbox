// TODOアプリ💖
// LocalStorageにデータを保存するよー✨

const STORAGE_KEY = 'todoAppData';

// DOM要素を取得
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalCount = document.getElementById('totalCount');
const doneCount = document.getElementById('doneCount');
const remainCount = document.getElementById('remainCount');
const clearDoneBtn = document.getElementById('clearDoneBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

// TODOデータの配列
let todos = [];

// LocalStorageからデータを読み込む💾
function loadTodos() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        todos = JSON.parse(data);
    }
    renderTodos();
}

// LocalStorageにデータを保存する💾
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// タスクを追加する➕
function addTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        // 空っぽだったら何もしないよー💦
        todoInput.placeholder = 'テキストを入力してね！✨';
        setTimeout(() => {
            todoInput.placeholder = '新しいタスクを追加...✨';
        }, 2000);
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    todos.unshift(newTodo);
    saveTodos();
    renderTodos();

    // 入力欄をクリア🧹
    todoInput.value = '';
    todoInput.focus();
}

// タスクを削除する🗑️
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// タスクの完了状態を切り替える✅
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// 完了済みを削除する🧹
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
}

// 全部削除する💥
function clearAll() {
    if (confirm('ほんとに全部削除しちゃうよ？💦')) {
        todos = [];
        saveTodos();
        renderTodos();
    }
}

// タスクリストを描画する🎨
function renderTodos() {
    // リストをクリア
    todoList.innerHTML = '';

    // 統計を更新
    updateStats();

    // 空っぽのときのメッセージ📭
    if (todos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <p>🎉 タスクがないよー！</p>
                <p>新しいタスクを追加してね✨</p>
            </div>
        `;
        return;
    }

    // タスクを表示
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <input type="checkbox"
                   ${todo.completed ? 'checked' : ''}
                   onchange="toggleTodo(${todo.id})">
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">削除🗑️</button>
        `;

        todoList.appendChild(li);
    });
}

// 統計を更新する📊
function updateStats() {
    const total = todos.length;
    const done = todos.filter(t => t.completed).length;
    const remain = total - done;

    totalCount.textContent = `全${total}件`;
    doneCount.textContent = `完了${done}件`;
    remainCount.textContent = `残り${remain}件`;
}

// HTMLエスケープ（セキュリティ対策）🔒
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// イベントリスナーを登録🎧
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

clearDoneBtn.addEventListener('click', clearCompleted);
clearAllBtn.addEventListener('click', clearAll);

// アプリ起動！🚀
loadTodos();
