const createUserTabel = require('./users');
const createParfumsTable = require('./parfums');
const createGenreTable = require('./genre');
const createOrdersTable = require('./ordersTabel');
const createOrderItemJoinTable = require('./orderItemJoin');


function create(){
    
    createUserTabel().then(() => {
        console.log('Finished setting up the database.');
      }).catch(error => {
        console.error('Error setting up the database:', error);
      });
      
      createParfumsTable().then(() => {
        console.log('Finished setting up the database.');
      }).catch(error => {
        console.error('Error setting up the database:', error);
      });
      
      createGenreTable().then(() => {
        console.log('Finished setting up the database.');
      }).catch(error => {
        console.error('Error setting up the database:', error);
      });

      createOrdersTable().then(() => {
        console.log('Finished setting up the database.');
      }).catch(error => {
        console.error('Error setting up the database:', error);
      });

      createOrderItemJoinTable().then(() => {
        console.log('Finished setting up the database.');
      }).catch(error => {
        console.error('Error setting up the database:', error);
      });
}

exports.create = create;