//对变量先ref后computed会出问题~~~

//用await会解决用then出现的异步陷阱

//想给store的异步方法加锁，是否多此一举

// watchEffect和computed感觉选择困难

//???
// #app {
//   height: 900px;
//   .box {
//     height: 100%;
//     background-color: rgba(0, 82, 110, 0.3);
//   }
//   .custom-dialog {
//   background-color: black;
//   margin-top: 100px;
//   height: 220px;
//   padding: 5px;
//   .alertInfo {
//     color: aliceblue;
//     font-size: 8px;
//     .title {
//       margin-top: -10px;
//     }
//     h1 {
//       color: white;
//       font-size: 14px;
//       font-weight: lighter;
//       margin-top: 10px;
//     }
//   }
//   .dialog-footer {
//     opacity: 50%;
//     position: absolute;
//     top: 190px;
//     .close {
//       width: 40px;
//       height: 20px;
//       color: white;
//       font-size: 10px;
//       font-weight: lighter;
//       background-color: rgb(25, 131, 230);
//       opacity: 50%;
//     }
//   }
// }
// }