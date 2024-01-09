const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL);




// User.deleteMany({__v: 0}).then((result)=> {
//     console.log(result);
// }).catch((error)=> {
//     console.log(error)
// });

// const person = new User({
//     name: 'Huzaifa',
//     email: '    huz@gmail.com          ',
//     password: '      huz.pass@240302  ',
//     age: 22,
// });

// person.save().then(()=> {
//     console.log(person);
// }).catch((error) => {
//     console.log('Error!', error)
// });



// const tea = new Tasks({
//     description: '     Ginger Tea',
//     // completed: true
// });

// tea.save().then(()=> {
//     console.log(tea);
// }).catch((error) => {
//     console.log(error)
// });
