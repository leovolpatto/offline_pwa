class UI{

    renderTodos(){
        var todos = new TodoRepository();
        var me = this;
        todos.all()
            .then(ts => {
                ts.forEach(function(t) {
                    me.renderTodo(t);
                });
            })
            .catch(e => {
                alert('Unable to query Todos');
                console.log(e);
            });        
    }
    
    constructor(){
        this.renderTodo = function(todo){
            document.getElementById('content').appendChild(this.createNav(todo));
        }

        this.createNav = function(todo){
            var div = document.createElement("div");

            var h3 = document.createElement('h3');
            h3.innerText = todo.title;

            var h4 = document.createElement('h4');
            h4.innerText = todo.id;            

            div.appendChild(h4);
            div.appendChild(h3);
            
            return div;
        }
    }

}