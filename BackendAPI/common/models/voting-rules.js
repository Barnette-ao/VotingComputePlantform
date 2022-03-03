'use strict';

module.exports = function(Votingrules) {
	Votingrules.createFile = function(editRule, cb) {
		const fs = require('fs');
		const path = require('path');

		var language = editRule.language;

		var programSuffx,dataSuffx;

		if (language == "picat") {
			programSuffx = ".pi",
      dataSuffx = ".pi"
		} else {
			programSuffx = ".lp",
      dataSuffx = ".txt"
		}

		var programFileContent = 'D:\\clingo\\'

    var programFileName = editRule.ruleName + '_program' + programSuffx

		var programFilePath = path.join(programFileContent,programFileName);
		console.log("文件路径",programFilePath)

		var programFD = fs.openSync(programFilePath, 'w+');

		var programContent = editRule.program;

		console.log("程序为", programContent);
		fs.writeFile(programFD, programContent, (err) => {
			if (err) {
				console.log(err);
				return;
			}
			console.log(`程序写入成功`);
		})

    var dataFileName = editRule.ruleName + '_dataform' + dataSuffx

		var dataFormFilePath = path.join(programFileContent,  dataFileName);

		var dataFormFD = fs.openSync(dataFormFilePath, 'w+');

		var dataFormContent = editRule.dataExample;
		//
		console.log("数据范例为", dataFormContent);
		fs.writeFile(dataFormFD, dataFormContent, (err) => {
			if (err) {
				console.log(err);
				return;
			}
			console.log(`数据范例写入成功`);
		})

		var response = 'success for creating program file and dataform file';

		cb(null, response);

	};


	Votingrules.remoteMethod(
		'createFile', {
			http: {
				path: '/createFile',
				verb: 'post'
			},
			accepts: {
				arg: 'editRule',
				type: 'Object'
			},
			returns: {
				arg: 'isCreateOK',
				type: 'string'
			}
		}
	);

  Votingrules.computeVotingRule = function(votingRule, cb) {

    // createProgramAndDataFile(votingRule)

    var votingRuleLanguage = votingRule.language;

    if(votingRuleLanguage == "ASP"){

       console.log("执行ASP程序")

       executeAspProgram(votingRule)

    }else{

       console.log("执行Picat程序")

       executeAspProgram(votingRule)

    }

    // 创建程序文件和数据文件
    function createProgramAndDataFile(votingRule){

      var votingRuleLanguage = votingRule.language;

      if (votingRuleLanguage == "picat") {

          createPicatProgramAndDataFile(votingRule)

      } else {

          createAspProgramAndDataFile(votingRule)

      }
    }

    // 创建picat程序与数据文件
    function createPicatProgramAndDataFile(votingRule){

      createPicatProgram(votingRule)

      createPicatData(votingRule)

    }

    // 创建ASP程序和数据文件
    function createAspProgramAndDataFile(votingRule){

      createAspProgram(votingRule)

      createAspData(votingRule)

    }

    // 创建ASP程序
    function createAspProgram(votingRule){

       var AspProgramSuffx = ".lp"

       var AspProgramFileName = votingRule.ruleName + '_program' + AspProgramSuffx

       const path = require('path');

       var AspProgramFileContent = 'D:\\clingo\\'

       var AspProgramFilePath = path.join(AspProgramFileContent,AspProgramFileName);

       const fs = require('fs');

       var AspProgramFD = fs.openSync(AspProgramFilePath, 'w+');

       var AspProgramContent = votingRule.program;

       fs.writeFile(AspProgramFD, AspProgramContent, (err) => {
       	if (err) {
       		console.log(err);
       		return;
       	}
       })
    }

    // 创建ASP数据
    function createAspData(votingRule){

      var AspDataSuffx = ".txt"

      var AspDataFileName = votingRule.ruleName + '_dataform' + AspDataSuffx

      const path = require('path');

      var AspDataFileContent = 'D:\\clingo\\'

      var AspDataFormFilePath = path.join(AspDataFileContent,AspDataFileName);

      const fs = require('fs');

      var AspDataFormFD = fs.openSync(AspDataFormFilePath, 'w+');

      var AspDataFormContent = votingRule.dataExample;
      //
      fs.writeFile(AspDataFormFD, AspDataFormContent, (err) => {
      	if (err) {
      		console.log(err);
      		return;
      	}
      })

    }

    //创建picat程序
    function createPicatProgram(votingRule){

      var picatProgramSuffx = ".pi"

      var picatProgramFileName = votingRule.ruleName + '_program' + picatProgramSuffx

      const path = require('path');

      var picatProgramFileContent = 'D:\\clingo\\'

      var picatProgramFilePath = path.join(picatProgramFileContent, picatProgramFileName);

      const fs = require('fs');

      var picatProgramFormFD = fs.openSync(picatProgramFilePath, 'w+');

      var picatProgramFormContent = votingRule.program;
      //
      fs.writeFile(picatProgramFormFD, picatProgramFormContent, (err) => {
      	if (err) {
      		console.log(err);
      		return;
      	}
      })
    }

    //创建picat数据
    function createPicatData(votingRule){

      var picatDataSuffx = ".pi"

      var picatDataFileName = votingRule.ruleName + '_dataform' + picatDataSuffx

      var picatProgramFileContent = 'D:\\clingo\\'

      const path = require('path');

      var picatDataFormFilePath = path.join(picatProgramFileContent,  picatDataFileName);

      const fs = require('fs');

      var picatDataFormFD = fs.openSync(picatDataFormFilePath, 'w+');

      var picatDataFormContent = votingRule.dataExample;
      //
      fs.writeFile(picatDataFormFD, picatDataFormContent, (err) => {
      	if (err) {
      		console.log(err);
      		return;
      	}
      })
    }

    //作用：执行ASP程序
    //合法输入：一个votingRule，数据类型是对象，必须具备两个key：ruleName，id
    //预期输出：picat程序的执行结果
    //错误情况1：aspCommand，命令字符串少了一个空格，修改情况，必须
    //错误情况2：var router = 'D:\clingo\'
    //前置条件1：数据文件路径形式正确，没有写错，内容也没有写错；
    //前置条件2：程序文件路径形式正确，没有写错，内容也没有写错；
    //前置条件3：程序文件和数据文件在各自所属路径之下真的存在
    //前置条件4：Windows路径分隔符是\\,\为转义字符

    function executeAspProgram(votingRule){

      const path = require('path');

      const exec = require('child_process').exec;

      var votingRuleName = votingRule.ruleName;

      var programFileName = votingRuleName + '_program.lp'

      var dataFileName = votingRuleName + '_dataform.txt'

      var router = 'D:\\clingo\\'

      var programParam = path.join(router,  programFileName);

      const fs = require('fs');

      //程序文件是否存在
      //测试，将路径下的程序文件移走
      fs.exists(programParam, (exists) => {
        if (!exists) {
            createAspProgram(votingRule)
        }
      });

      var dataParam = path.join(router,  dataFileName);

      //数据文件是否存在
      //将该路径下的数据文件移走
      fs.exists(dataParam, (exists) => {
          if (!exists) {
              createAspData(votingRule)
          }
      });

      var aspCommand = "clingo " + " " +programParam + " "+ dataParam

      let aspChildProcess = exec(aspCommand , function (error, stdout, stderr){
             console.log("stdout",stdout)
             cb(null, stdout);
      });
      
      // var aspCommand = "clingo D:\\clingo\\testASPprogram_program.lp D:\\clingo\\testASPprogram_dataform.txt"
      
      // console.log("votingRuleName",votingRuleName)
      // console.log("programFileName",programFileName)
      // console.log("dataFileName",dataFileName)
      // console.log("programParam",programParam)
      // console.log("dataParam",dataParam)
      // console.log("aspCommand",aspCommand)

    }


    //作用：执行picat程序
    //合法输入：一个votingRule，数据类型是对象，必须具备两个key：ruleName，id
    //预期输出：picat程序的执行结果
    //错误情况：待补充
    //错误情况2：var router = 'D:\clingo\'
    //前置条件1：数据文件路径形式正确，没有写错，内容也没有写错；
    //前置条件2：程序文件路径形式正确，没有写错，内容也没有写错；
    //前置条件3：程序文件和数据文件在各自所属路径之下真的存在
    //前置条件4：Windows路径分隔符是\\,\为转义字符

    function executePicatProgram(votingRule){

      const path = require('path');

      const exec = require('child_process').exec;

      var votingRuleName = votingRule.ruleName;

      var programFileName = votingRuleName + '_program.pi'

      var dataFileName = votingRuleName + '_dataform.pi'

      var picatCommand = "picat " + " " + programParam + " "+ dataParam

      if(votingRule.id == "620009e9bd5633210c095fda" ){
          picatCommand = picatCommand +" "+"0"
      }
      // var aspCommand = "clingo D:\\clingo\\testASPprogram_program.lp D:\\clingo\\testASPprogram_dataform.txt"
      console.log("votingRuleName",votingRuleName)
      console.log("programFileName",programFileName)
      console.log("dataFileName",dataFileName)
      console.log("picatCommand",picatCommand)

      var enterPicatFileCommand = "cd ~/Desktop/Picat/"

      let enterPicatFileChildProcess = exec(enterPicatFileCommand , function (error, stdout, stderr){
            console.log("enter the Picat foldFile!")
      });
      
      const fs = require('fs');
      
      //程序文件是否存在
      //测试，将路径下的程序文件移走
      fs.exists(programParam, (exists) => {
        if (!exists) {
            createPiactProgram(votingRule)
        }
      });
      
      //数据文件是否存在
      fs.exists(dataParam, (exists) => {
          if (!exists) {
              createPicatData(votingRule)
          }
      });

      let picatChildProcess = exec(picatCommand , function (error, stdout, stderr){
             console.log("stdout",stdout)
             cb(null, stdout);
      });

    }

  };



  Votingrules.remoteMethod(
  	'computeVotingRule', {
  		http: {
  			path: '/computeVotingRule',
  			verb: 'post'
  		},
  		accepts: {
  			arg: 'votingRule',
  			type: 'Object'
  		},
  		returns: {
  			arg: 'computeResult',
  			type: 'string'
  		}
  	}
  );

};
