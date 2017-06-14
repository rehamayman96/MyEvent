//Required Dependencies
let Event = require('../models/Event');

let eventController = {
    //Add Event function
    addEvent: function (req, res) {
        req.checkBody('name', 'Name is required').notEmpty();
        req.checkBody('date', 'Date is required').notEmpty();
        req.checkBody('category', 'Category is required').notEmpty();

        var errors = req.validationErrors();
        if (errors) {
            res.render('addevent', {
                errors: errors
            });
        }
        else {
            let event = new Event({
                name: req.body.name,
                date: req.body.date,
                category: req.body.category,
                username: req.user.username
            })

            event.save(function (err, evnt) {
                if (err)
                    consol.log(err)
                else {
                    console.log(event);
                    res.redirect('/addevent');
                }
            })
        }
    },

    viewAllevents: function (req, res) {
        Event.find({ username: req.user.username }, function (err, events) {
            if (err) {
                req.flash('error_msg', 'You do not have any Events yet!');
            } else {
                var allevents = [];
                for (var i = 0; i < events.length; i++) {
                    var year = events[i].date.getFullYear();
                    var month = (1 + events[i].date.getMonth()).toString();
                    month = month.length > 1 ? month : '0' + month;
                    var day = events[i].date.getDate().toString();
                    day = day.length > 1 ? day : '0' + day;
                    var date = year + '-' + month + '-' + day;

                    eve = {
                        name: events[i].name,
                        date: date,
                        category: events[i].category
                    }
                    allevents.push(eve);
                }
                console.log(allevents);
                res.render('viewAllevents', { allevents });
            }
        })
    },

    filterevents: function (req, res) {
        Event.find({ username: req.user.username, category: req.body.category }, function (err, events) {
            if (err) {
                req.flash('error_msg', 'You do not have any Events yet!');
            } else {
                var allevents = [];
                for (var i = 0; i < events.length; i++) {
                    var year = events[i].date.getFullYear();
                    var month = (1 + events[i].date.getMonth()).toString();
                    month = month.length > 1 ? month : '0' + month;
                    var day = events[i].date.getDate().toString();
                    day = day.length > 1 ? day : '0' + day;
                    var date = year + '-' + month + '-' + day;

                    eve = {
                        name: events[i].name,
                        date: date,
                        category: events[i].category
                    }
                    allevents.push(eve);
                }
                console.log(allevents);
                res.render('viewAllevents', { allevents });
            }
        })
    },

    autocomplete: function (req, res) {
        var b = req.params.search;
        Event.find({ username: req.user.username, name: new RegExp(b, 'i') }).limit(5).toArray(function (err, items) {
            res.jsonp(items);
        });
    },


    search: function (req, res) {
        if (req.body.search) {
            const regex = new RegExp(escapeRegex(req.body.search), 'gi');
            Event.find({ username: req.user.username, name: regex }, function (err, events) {
                if (err) {
                    req.flash('error_msg', 'You do not have any Events yet!');
                } else {
                    var allevents = [];
                    for (var i = 0; i < events.length; i++) {
                        var year = events[i].date.getFullYear();
                        var month = (1 + events[i].date.getMonth()).toString();
                        month = month.length > 1 ? month : '0' + month;
                        var day = events[i].date.getDate().toString();
                        day = day.length > 1 ? day : '0' + day;
                        var date = year + '-' + month + '-' + day;

                        eve = {
                            name: events[i].name,
                            date: date,
                            category: events[i].category
                        }
                        allevents.push(eve);
                    }
                    console.log(allevents);
                    res.render('search', { allevents });
                }
            })
        }
        else {
            Event.find({ username: req.user.username }, function (err, events) {
                if (err) {
                    req.flash('error_msg', 'You do not have any Events yet!');
                } else {
                    var allevents = [];
                    for (var i = 0; i < events.length; i++) {
                        var year = events[i].date.getFullYear();
                        var month = (1 + events[i].date.getMonth()).toString();
                        month = month.length > 1 ? month : '0' + month;
                        var day = events[i].date.getDate().toString();
                        day = day.length > 1 ? day : '0' + day;
                        var date = year + '-' + month + '-' + day;

                        eve = {
                            name: events[i].name,
                            date: date,
                            category: events[i].category
                        }
                        allevents.push(eve);
                    }
                    console.log(allevents);
                    res.render('search', { allevents });
                }
            })

        }
    }

}

     function escapeRegex (text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
module.exports = eventController;