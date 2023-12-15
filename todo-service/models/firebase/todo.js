class Todo {
    constructor(uuid, todo_name, status, is_active, created_date, updated_date) {
        this.uuid = uuid,
        this.todo_name = todo_name,
        this.status = status,
        this.is_active = is_active
        this.created_date = created_date,
        this.updated_date = updated_date
    }
}

module.exports = Todo;