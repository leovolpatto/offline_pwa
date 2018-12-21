class TodoRepository{    
    all() {
        return new Promise((resolve, reject) => {
            fetch('https://jsonplaceholder.typicode.com/todos')
                .then(result => {
                    result.json()
                        .then(todos => {
                            resolve(todos);
                        });
                })
                .catch(e => {
                    reject(e);
                })
        });
    }
}