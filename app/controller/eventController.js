//Required Dependencies
let Event = require('../models/Event');

let eventController = {
    //Add Event function
    addEvent: function (req, res) {
        req.checkBody('name', 'Name is required').notEmpty();
        req.checkBody('date', 'Date is required').notEmpty();
        req.checkBody('category', 'Category is required').notEmpty();
        //check if any of the inputs is empty
        var errors = req.validationErrors();
        if (errors) {
            res.render('addevent', {
                errors: errors
            });
        }
        else {
            //creating the object
            let event = new Event({
                name: req.body.name,
                date: req.body.date,
                category: req.body.category,
                username: req.user.username
            })
            //save the object in the event collection
            event.save(function (err, evnt) {
                if (err){
                  req.flash('error', 'Could not save correctly!');
                  res.redirect('/addevent');
                }
                else {
                    req.flash('success_msg', 'Your Event has been created successfully');
                    res.redirect('/addevent');
                }
            })
        }
    },

    //View all events of the user
    viewAllevents: function (req, res) {
        Event.find({ username: req.user.username }, function (err, events) {
            if (err) {
                req.flash('error_msg', 'You do not have any Events yet!');
                res.redirect('/addevent')
            } else {
                var allevents = [];
                //extract the date frome datetime for each event
                for (var i = 0; i < events.length; i++) {
                    var year = events[i].date.getFullYear();
                    var month = (1 + events[i].date.getMonth()).toString();
                    month = month.length > 1 ? month : '0' + month;
                    var day = events[i].date.getDate().toString();
                    day = day.length > 1 ? day : '0' + day;
                    var date = year + '-' + month + '-' + day;
                    //create a new event object with the new date format
                    eve = {
                        name: events[i].name,
                        date: date,
                        category: events[i].category
                    }
                    //push the new object in the allevents array
                    allevents.push(eve);
                }
                //send allevents array to viewAllevents html page
                res.render('viewAllevents', { allevents });
            }
        })
    },
    //filter the events of the user according to the chosen category
    filterevents: function (req, res) {
        Event.find({ username: req.user.username, category: req.body.category }, function (err, events) {
            if (err) {
                req.flash('error_msg', 'You do not have any Events yet in this category!');
                res.redirect('/addevent')
            } else {
                var allevents = [];
                //extract the date frome datetime for each event
                for (var i = 0; i < events.length; i++) {
                    var year = events[i].date.getFullYear();
                    var month = (1 + events[i].date.getMonth()).toString();
                    month = month.length > 1 ? month : '0' + month;
                    var day = events[i].date.getDate().toString();
                    day = day.length > 1 ? day : '0' + day;
                    var date = year + '-' + month + '-' + day;
                    //create a new event object with the new date format
                    eve = {
                        name: events[i].name,
                        date: date,
                        category: events[i].category
                    }
                    //push the new object in the allevents array
                    allevents.push(eve);
                }
                //send allevents array to viewAllevents html page
                res.render('viewAllevents', { allevents });
            }
        })
    },
    //Auto complete function for the search
    autocomplete: function (req, res) {
        var b = req.params.search;
        Event.find({ username: req.user.username, name: new RegExp(b, 'i') }).limit(5).toArray(function (err, items) {
            res.jsonp(items);
        });
    },

    //Fuzzy search by the name of the event for the authenticated user
    search: function (req, res) {
        if (req.body.search) {
            const regex = new RegExp(escapeRegex(req.body.search), 'gi');
            Event.find({ username: req.user.username, name: regex }, function (err, events) {
                if (err) {
                    req.flash('error_msg', 'No match Found!');
                } else {
                    var allevents = [];
                    //extract the date frome datetime for each event
                    for (var i = 0; i < events.length; i++) {
                        var year = events[i].date.getFullYear();
                        var month = (1 + events[i].date.getMonth()).toString();
                        month = month.length > 1 ? month : '0' + month;
                        var day = events[i].date.getDate().toString();
                        day = day.length > 1 ? day : '0' + day;
                        var date = year + '-' + month + '-' + day;
                    //create a new event object with the new date format
                        eve = {
                            name: events[i].name,
                            date: date,
                            category: events[i].category
                        }
                        //push the new object in the allevents array
                        allevents.push(eve);
                    }
                    //send allevents array to viewAllevents html page
                    res.render('search', { allevents });
                }
            })
        }
        //if no input was found retreive all the events of the user 
        else {
            Event.find({ username: req.user.username }, function (err, events) {
                if (err) {
                    req.flash('error_msg', 'You do not have any Events yet!');
                } else {
                    var allevents = [];
                    //extract the date frome datetime for each event
                    for (var i = 0; i < events.length; i++) {
                        var year = events[i].date.getFullYear();
                        var month = (1 + events[i].date.getMonth()).toString();
                        month = month.length > 1 ? month : '0' + month;
                        var day = events[i].date.getDate().toString();
                        day = day.length > 1 ? day : '0' + day;
                        var date = year + '-' + month + '-' + day;
                    //create a new event object with the new date format
                        eve = {
                            name: events[i].name,
                            date: date,
                            category: events[i].category
                        }
                        //push the new object in the allevents array
                        allevents.push(eve);
                    }
                    //send allevents array to viewAllevents html page
                    res.render('search', { allevents });
                }
            })

        }
    }

}
//Function to replace some chatacters with others 
     function escapeRegex (text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
module.exports = eventController;