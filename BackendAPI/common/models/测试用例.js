

   

    const exec = require('child_process').exec;



   let aspChildProcess = exec("clingo D:\\clingo\\testASPprogram_program.lp D:\\clingo\\testASPprogram_dataform.txt ", function (error, stdout, stderr){
	   console.log("stdout",stdout)
	 
   });

   