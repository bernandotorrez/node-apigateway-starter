class Todo {
    constructor(uuid, todo_name, status, is_active) {
        this.uuid = uuid,
        this.todo_name = todo_name,
        this.status = status,
        this.is_active = is_active
    }
}

module.exports = Todo;