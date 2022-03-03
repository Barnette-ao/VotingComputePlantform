// module.exports = function(app) {
//   var User = app.models.admin;
//   // var Role = app.models.Role;
//   // var RoleMapping = app.models.RoleMapping;

//   User.create(
//     [{
//       "roles":"admin",
//       "introduction": "I am a administrator",
//       "createdTime": "2022-02-04T12:27:15.983Z",
//       "state": 0,
//       "isAdmin": true,
//       "username": "admin",
//       "password": "111111"
//     }],
//     function(err, users) {
//       if (err) throw err;

//       console.log("Created users:", users);

//     //   create the admin role
//     //   Role.create({
//     //       name: "testUser"
//     //     },
//     //     function(err, role) {
//     //       if (err) throw err;

//     //       console.log("Created role:", role);

//     //       //make RoleMapping
//     //       role.principals.create({
//     //           principalType: RoleMapping.USER,
//     //           principalId: users[0].id
//     //         },
//     //         function(err, principal) {
//     //           if (err) throw err;

//     //           console.log("Created principal:", principal);
//     //         }
//     //       );
//     //     }
//     //   );
//     }
//   );
// };
