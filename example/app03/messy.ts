var x=1
var y=2
var z=3

function a(b:any,c:any){
return b+c
}

function d(e,f){
console.log(e)
console.log(f)
console.log(e+f)
return e*f
}

const g=function(h,i,j){
if(h==1)return"one"
if(h==2)return"two"
if(h==3)return"three"
return i+j
}

var obj={n:"test",v:123}
console.log(obj.n)
console.log(obj.v)

x=a(x,y)
console.log(x)

var arr=[1,2,3,4,5]
for(var i=0;i<arr.length;i++){
console.log(arr[i])
arr[i]=arr[i]*2
}
console.log(arr)

function calc(s){
    eval("return "+s)
}

var result=calc("1+1")
console.log(result)
