$(function () {
    'use strict';

    var ENTER_KEY = 13;

    // Make the user log in
    TodoList.auth();

    $('#todoAdd').on('click', function () {
        var $descInput = $('#todoDesc');
        var value = $descInput.val();

        if (!value) {
            return;
        }

        var todo = {
            description: value,
            priority: 'medium',
            completed: false
        };

        TodoList.addTask(todo);
        $descInput.val('').focus();
    });

    $('#todoDesc').on('keyup', function (e) {
        if (e.keyCode === ENTER_KEY) {
            $('#todoAdd').trigger('click');
        }
    });
});


var TodoList = {
    firebase: new Firebase("https://boiling-heat-4673.firebaseio.com"),

    auth: function () {
        // login with google and get our todo list
        this.firebase.authWithOAuthPopup("google", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                $('body').removeClass('auth');
                this.todos = this.firebase.child('users/' + authData.uid);
            }

            this.init();
        }.bind(this));
    },

    init: function () {
        // Any time our todolist data changes pull down the new data and re-render the list
        this.todos.on("value", function (snapshot) {
            $('#todoList').empty();
            snapshot.forEach(function (todo) {
                this._renderTask(todo.val(), todo);
            }.bind(this));
        }.bind(this));
    },

    addTask: function (todo) {
        this.todos.push(todo);
    },

    remove: function (id) {
        this.todos.child(id).remove();
    },

    /**
     * Toggle a given todo's complete state
     * @param {String} id
     */
    toggleComplete: function (id) {
        var todoRef = this.todos.child(id) ;
        todoRef.once('value', function (snapshot) {
            var todo = snapshot.val();
            todoRef.child('completed').set(!todo.completed);
        });
    },

    /**
     * Create the actual html for a todo
     * @param {Object} todo
     * @param {DataSnapshot} ref
     */
    _renderTask: function (todo, ref) {
        // create todo item and add to the DOM
        var $todoList = $('#todoList');
        var $todo = $('<li>');
        $todo.data('id', ref.key());
        $todo.toggleClass('completed', todo.completed);
        $todo.addClass('priority-' + todo.priority);

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
            $('<label class="description">' + todo.description + '</label>')
        );

        // setup delete button
        var $deleteBtn = $('<button class="remove">&times;</button>');
        $deleteBtn.on('click', function (e) {
            var $todo = $(e.target).closest('li');
            TodoList.remove($todo.data('id'));
            $todo.remove();
        });
        $todo.append($deleteBtn);

        // finally add it to the list of todos
        $todo.appendTo($todoList);
    }
};

