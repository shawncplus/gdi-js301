$(function () {
    'use strict';

    var ENTER_KEY = 13;

    $('#todoAdd').on('click', function () {
        var $descInput = $('#todoDesc');
        var value = $descInput.val();

        if (!value) {
            return;
        }

        var task = {
            description: value,
            priority: 'medium',
            done: false
        };

        TodoList.addTask(task);
        $descInput.val('').focus();
    });

    $('#todoDesc').on('keyup', function (e) {
        if (e.keyCode === ENTER_KEY) {
            $('#todoAdd').trigger('click');
        }
    });
});


var TodoList = {
    cursor: 0,
    todos: [],

    addTask: function (task) {
        task.id = TodoList.cursor++;
        // Add the task to the data list
        this.todos.push(task);

        // create todo item and add to the DOM
        var $todoList = $('#todoList');
        var $todo = $('<li>');
        $todo.data('id', task.id);
        $todo.addClass('priority-' + task.priority);

        // setup complete toggle
        var $completeCheck = $('<input type="checkbox" class="complete-check">');
        $completeCheck.on('change', function (e) {
            var $todo = $(e.target).closest('li');
            $todo.toggleClass('completed');
            TodoList.toggleComplete($todo.data('id'));
        });

        $todo.append($completeCheck);

        // add description
        $todo.append(
            $('<label class="description">' + task.description + '</label>')
        );

        var $deleteBtn = $('<button class="remove">&times;</button>');
        $deleteBtn.on('click', function (e) {
            var $todo = $(e.target).closest('li');
            TodoList.remove($todo.data('id'));
            $todo.remove();
        });
        $todo.append($deleteBtn);

        $todo.appendTo($todoList);
    },

    toggleComplete: function (id) {
        var index = this._indexForId(id);
        var task = this.todos[index];
        task.completed = !task.completed;
    },

    remove: function (id) {
        var index = this._indexForId(id);
        this.todos.splice(index, 1);
    },

    _indexForId: function (id) {
        var index = null;
        this.todos.some(function (todo, todoIndex) {
            if (todo.id === id) {
                index = todoIndex;
                return true;
            }
        });

        return index;
    }
};

