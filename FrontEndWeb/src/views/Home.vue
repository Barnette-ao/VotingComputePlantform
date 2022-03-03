<template>
	<div id="app">
		<el-container>
			<el-header>
				<div class="header">
					<div class="plateFormName">
						<el-button type="text" style="color:black">投票计算平台</el-button>
					</div>
					<div class="userProfile">
						<el-dropdown>
							<span class="el-dropdown-link">
								<i style="font-size:20px" class="el-icon-user"></i>
								<i class="el-icon-arrow-down el-icon--right"></i>
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item disabled>{{user.username}}</el-dropdown-item>
								<el-dropdown-item divided @click.native="information()">个人信息</el-dropdown-item>
								<el-dropdown-item divided @click.native="result()">投票结果</el-dropdown-item>
								<el-dropdown-item divided @click.native="quit()">退出</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
				</div>
			</el-header>
			<el-container class="middle">
				<el-aside>
					<el-menu router :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen"
						@close="handleClose">
						<el-menu-item index="/home">
							<i class="el-icon-location"></i>
							<span slot="title">Home</span>
						</el-menu-item>
						<el-menu-item index="/guide">
							<i class="el-icon-menu"></i>
							<span slot="title">用户指南</span>
						</el-menu-item>
					</el-menu>
				</el-aside>
				<el-main>
					<div class="votingList">
						<div class="votingListHead">
							<div class="votingListName">
								<span class="votingListNameWord">
									投票规则
								</span>
							</div>
							<div class="addVotingRuleButton">
								<div class="addVotingRuleButtonEntity">
									<el-button @click="addVotingRule"> 添加投票规则</el-button>
								</div>
							</div>
						</div>
						<div class="votingListBody">
							<el-table :data="tableData" style="width: 100%">
								<el-table-column prop="ruleName" label="投票规则名称" width="180">
								</el-table-column>
								<el-table-column prop="language" label="规则表示语言" width="180">
								</el-table-column>
								<el-table-column label="操作">
									<template slot-scope="scope">
										<el-button size="mini" @click="computeVoting(scope.row)">投票计算</el-button>
										<el-button size="mini" @click="editVotingRule(scope.row)">编辑</el-button>
										<el-button size="mini" type="danger" @click="deleteVotingRule( scope.row)">删除
										</el-button>
									</template>
								</el-table-column>
							</el-table>
							<el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize"
								layout="prev, pager, next, jumper" :total="total">
							</el-pagination>
						</div>
					</div>

					<el-dialog title="个人信息" :visible.sync="Showinformation" :close-on-click-modal="false" width="700px"
						direction="horizontal">
						<el-form ref="user" :model="user" style="width: auto" size="small">
							<el-form-item label="用户名">
								<el-input v-model="user.username" />
							</el-form-item>
							<el-form-item label="用户身份">
								<el-input v-model="user.roles" />
							</el-form-item>
							<el-form-item label="个人介绍">
								<el-input v-model="user.introduction" type="textarea" maxlength="256"
									show-word-limit rows="5" style="margin-top:5px auto" placeholder="在此填写" />
							</el-form-item>
							<el-form-item>
								<el-button @click="saveinformation()">保存修改</el-button>
								<el-button @click="Showinformation=false">取消修改</el-button>
							</el-form-item>
						</el-form>
					</el-dialog>
				</el-main>
				<el-dialog :title="thisType == 'add'?'添加投票规则':'编辑投票规则'" :visible.sync="Showeditrules"
					:close-on-click-modal="false" width="700px" :fullscreen="fullscreen">
					<el-form ref="editForm" :model="editrules">
						<el-form-item label="投票规则名称" :label-width="formLabelWidth">
							<el-input v-model="editrules.ruleName" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="使用语言" :label-width="formLabelWidth">
							<div align="left">
								<el-select v-model="editrules.language" placeholder="请选择">
									<el-option v-for="language in languages" :key="language.value"
										:label="language.label" :value="language.value"></el-option>
								</el-select>
							</div>
						</el-form-item>
						<el-form-item label="是否开放" :label-width="formLabelWidth">
							<div align="left">
								<el-switch v-model="editrules.isOpen" active-color="#13ce66" inactive-color="#ff4949">
								</el-switch>
							</div>
						</el-form-item>
						<el-form-item label="投票规则程序" :label-width="formLabelWidth">
							<div align="left">
								<codemirror ref="editor" v-model="editrules.program" :options="cmOptions" />
							</div>
						</el-form-item>
						<el-form-item label="输入数据范例" :label-width="formLabelWidth">
							<div align="left">
								<codemirror ref="inputDataForm" v-model="editrules.dataExample" :options="cmOptions" />
							</div>
						</el-form-item>
						<el-row :gutter="20">
							<el-col :span="1">
								<el-form-item align="left">
									<el-button @click="computeVotingRule()">运行</el-button>
								</el-form-item>
							</el-col>
							<el-col :span="1" :offset="1">
								<el-form-item align="left">
									<el-button @click="exportProgramAndDataform()">导出程序和数据范例</el-button>
								</el-form-item>
							</el-col>
						</el-row>
						<el-form-item label="运行结果" :label-width="formLabelWidth">
							<el-input v-model="editrules.computeResult" type="textarea" rows="5"
								style="margin-top:5px auto" />
						</el-form-item>
						<el-form-item>
							<el-button @click="clickOK()">保存</el-button>
							<el-button @click="Showeditrules=false">放弃</el-button>
						</el-form-item>
					</el-form>
				</el-dialog>
				<el-aside>rightAside</el-aside>
			</el-container>
		</el-container>
		<router-view />
	</div>
</template>

<script>
	// @ is an alias to /src
	// import HelloWorld from '@/components/HelloWorld.vue'
	import {
		codemirror
	} from 'vue-codemirror'
	import {
		createVotingRule,
		getOneVotingRule,
		updateVotingRule,
		computeVotingRule
	} from '@/api/votingRule'
	import {
		saveUserVoteRelation,
		getUserVotingRules,
		updateUserVotingRule
	} from '@/api/userVote'
	import {
		editUserInfo,
		getOnePlantformUser,
		getUserVotingRulesListCount
	} from '@/api/user'
	import {
		saveData
	} from '@/api/computingData'
	import FileSaver from "file-saver"
	import {
		getToken
	} from '@/utils/auth'

	import "codemirror/theme/ambiance.css";
	require("codemirror/mode/javascript/javascript");

	export default {
		name: "Home",
		components: {
			codemirror
		},
		data() {
			return {
				thisType: "add",
				user: {
					username: "",
					roles: "",
					introduction: ""
				},
				editrules: {
					ruleName: "",
					ruleCreator: "",
					language: "",
					program: "",
					dataExample: "",
					isOpen: true,
					computeResult: ""
				},
				languages: [{
						value: "picat",
						label: "picat"
					},
					{
						value: "ASP",
						label: "ASP"
					}
				],
				Showinformation: false,
				Showeditrules: false,
				tableData: [],
				currentRow: null,
				cmOptions: {
					mode: "text/javascript",
					theme: "ambiance",
					indentUnit: 2,
					smartIndent: true,
					tabSize: 4,
					readOnly: false,
					showCurorWhereSelecting: true,
					lineNumbers: true,
					firstLineNumber: 1
				},
				fullscreen: true,
				formLabelWidth: "100px",
				currentUser: "",
				total: 0,
				pageSize: 10,
				pageCount: 0,
				currentPage: 1
			};
		},
		created() {
			this.initData()
		},
		mounted() {
			this.user.username = sessionStorage.getItem('userName')
			this.editrules.ruleCreator = sessionStorage.getItem('userName')
			this.initData()
			// console.log("@@@当前用户名",this.user.username)
			// console.log("@@@当前用户名",this.editrules.ruleCreator)
		},
		methods: {
			initData() {
				this.getUserVotingRulesListCount()
				this.getUserVotingRulesList()
			},
			getUserVotingRulesListCount() {
				var _userInfo = this.$store.state.user
				var userId = _userInfo.id
				getUserVotingRulesListCount(userId,{
					where: {
						and: [{
								or: [{
									isOpen: true
								}, {
									adminId: userId
								}]
							},
							{
								isDelete: 0
							}
						]
					}
				}).then(response => {
					// console.log(response)
					this.total = response.count;
					this.pageCount = Math.ceil(this.total / this.pageSize);
					this.getUserVotingRulesList()
				}).catch(error => {
					console.log(error)
				})
			},
			getUserVotingRulesList() {
				var _userInfo = this.$store.state.user
				var userId = _userInfo.id
				getUserVotingRules({
					filter: {
						include: ["votingRules"],
						where: {
							and: [{
									or: [{
										isOpen: true
									}, {
										adminId: userId
									}]
								},
								{
									isDelete: 0
								}
							]
						},
						limit: this.pageSize,
						skip: (this.currentPage - 1) * this.pageSize
					}
				}).then(response => {
					// console.log("这是关联的投票规则的数据", response)
					var votingRuleArray = new Array()
					for (var i = 0; i < response.length; i++) {
						votingRuleArray[i] = response[i].votingRules
						votingRuleArray[i].userVotingId = response[i].id
					}
					// console.log("@@@投票规则", votingRuleArray)
					// const totalNumberofVotingRule = response.length
					this.tableData = votingRuleArray
				}).catch(error => {
					console.log(error)
				})
				// console.log(this.form)
			},
			quit() {
				this.$router.push({
					path: "/"
				});
			},
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			},
			backHome() {
				this.$router.push({
					path: "/home"
				});
			},
			information() {
				var _userInfo = this.$store.state.user
				// console.log("当前的用户实例对象", _userInfo)
				getOnePlantformUser(_userInfo.id, {
					filter: {
						where: {
							state: 0
						}
					}
				}).then(response => {
					// console.log("这是选中编辑的用户", response)
					this.user = response
				})
				this.Showinformation = true;
			},
			result() {
				this.$router.push({
					path: "/result"
				});
			},
			saveinformation() {
				var _userInfo = this.$store.state.user
				editUserInfo(_userInfo.token, this.user).then(response => {
					// console.log("@@@编辑选中用户之后的表单", this.user)
					console.log("@@@编辑返回的表单", response),
					this.Showinformation = false
					this.$message({
						message: '编辑用户信息成功',
						type: 'success'
					});
				}).catch(error => {
					this.$message({
						message: '编辑用户信息失败',
						type: 'error'
					});
					console.log(error)
				})
			},
			editRules() {
				this.editrules = {
					ruleName: "",
					language: "",
					ruleCreator: "",
					program: "",
					dataExample: "",
					computeResult: ""
				};
				this.Showeditrules = true;
			},
			addVotingRule() {
				this.editRules()
			},
			clickOK() {
				if (this.thisType == "add")
					this.createVotingRule()
				else
					this.updateVotingRule()
			},
			createVotingRule() {
				this.editrules.ruleCreator = this.user.username
				createVotingRule(this.editrules).then(response => {
					console.log("投票创造者", this.editrules.ruleCreator)
					// console.log("编辑之后的返回值", response)
					var savedVotingRule = response
					console.log("@@@保存的投票规则", savedVotingRule)
					this.createUserVote(savedVotingRule)
					this.Showeditrules = false
					this.$message({
						message: '编辑投票规则成功',
						type: 'success'
					});
				}).catch(error => {
					console.log(error)
					this.$message({
						message: '编辑投票规则失败',
						type: 'error'
					});
				});
				this.createVotingData()
				this.initData()
			},
			createVotingData() {
				var _data = {
					language: "",
					createdTime: "",
					dataUser: "",
					dataContent: ""
				}
				_data.language = this.editrules.language
				_data.createdTime = new Date()
				_data.dataUser = this.user.username
				_data.dataContent = this.editrules.dataExample
				saveData(_data).then(response => {
					console.log("保存的数据", response),
						this.$message({
							message: '保存数据成功',
							type: 'success'
						});
				}).catch(error => {
					console.log(error)
					this.$message({
						message: '保存数据失败',
						type: 'error'
					});
				});
			},
			createUserVote(savedVotingRule) {
				var _userVoteData = {
					adminId: "",
					votingRuleId: "",
					isOpen: "",
					state: 0
				}
				var _userInfo = this.$store.state.user
				_userVoteData.adminId = _userInfo.id
				_userVoteData.votingRuleId = savedVotingRule.id
				_userVoteData.isOpen = savedVotingRule.isOpen
				saveUserVoteRelation(_userVoteData).then(response => {
					console.log("返回的需要保存的用户-投票规则关系", response),
						this.$message({
							message: '保存用户-投票规则关系成功',
							type: 'success'
						});
				}).catch(error => {
					console.log(error)
					this.$message({
						message: '保存用户-投票规则关系失败',
						type: 'error'
					});
				});
			},
			editVotingRule(votingRule) {
				console.log("@@@被选中的点击编辑按钮的投票规则", votingRule)
				console.log("@@@被选中的点击编辑按钮的投票规则的id", votingRule.id)
				this.thisType = "edit"
				getOneVotingRule(votingRule.id, {}).then(response => {
					// console.log("这是选中编辑的投票规则",response)
					this.Showeditrules = true
					this.editrules = response

				})
			},
			updateVotingRule() {
				console.log("编辑用户信息，点击确定，重新编辑之后的表单", this.editrules)
				var _tocken = getToken();
				updateVotingRule(_tocken, this.editrules).then(response => {
					console.log("@@@编辑选中用户之后的表单", this.editrules)
					console.log(response),
					this.Showeditrules = false
					this.$message({
						message: '编辑投票规则成功',
						type: 'success'
					});
					this.initData()
				}).catch(error => {
					this.$message({
						message: '编辑投票规则失败',
						type: 'error'
					});
					console.log(error)
				})

			},
			deleteVotingRule(votingRule) {
				this.$confirm('此操作将删除该投票规则, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// console.log("@@@@选择被删除投票规则的实例",votingRule)
					var _votingRule = votingRule
					var deletedVotingRuleUserVoteId = _votingRule.userVotingId
					var updataIsDelete ={isDelete:1}
					var _tocken =  getToken();
					updateUserVotingRule(deletedVotingRuleUserVoteId,_tocken,updataIsDelete).then(response => {
						console.log(response),
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
						this.initData()
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});
				})
			},
			computeVotingRule() {
				console.log("点击运行按钮之后传输的数据", this.editrules)
				computeVotingRule({
					votingRule: this.editrules
				}).then(response => {
					console.log("点击运行按钮之后传输的数据", this.editrules)
					console.log("点击运行按钮之后的返回值", response),
					this.editrules.computeResult = response.computeResult
					this.$message({
						message: '计算成功',
						type: 'success'
					});
				}).catch(error => {
					console.log(error)
					this.$message({
						message: '计算失败',
						type: 'error'
					});
				})
			},
			exportProgramAndDataform() {
				console.log(this.editrules.program)
				var blobProgram = new Blob([this.editrules.program], {
					type: "text/plain;charset=utf-8"
				});
				FileSaver.saveAs(blobProgram, this.editrules.ruleName + "_program.pi");

				var blobDataExample = new Blob([this.editrules.dataExample], {
					type: "text/plain;charset=utf-8"
				});
				FileSaver.saveAs(blobDataExample, this.editrules.ruleName +"_data.txt");
			},
			handleCurrentChange(currentPage) {
				// console.log(`当前页: ${currentPage}`);
				this.currentPage = currentPage
				this.getUserVotingRulesList()
			},
			computeVoting(votingRule) {
				console.log("@@@投票规则表示程序",votingRule.dataExample)
				this.$router.push({
					name: "Vote",
					params: {
						votingRule:votingRule,
						votingRuleProgram: votingRule.program,   
						computeData: votingRule.dataExample  
					}  
				});
			}
		}
	}
</script>

<style>
	* {
		margin: 0px;
	}

	#app {}

	.el-header,
	.el-footer {
		background-color: #b3c0d1;
		color: #333;
		height: 10%;
	}

	.el-header {
		padding: 0px 0px;
	}

	.header {
		width: 100%;
		background-color: #ddd;
		/* border: 2px solid black; */
	}

	.plateFormName {
		display: inline-block;
		float: left;
		line-height: 60px;
		width: 280px;
		color: #fff;
		text-align: center;
	}

	.searchBar {
		display: inline-block;
		margin-left: 30px;
		line-height: 60px;
		width: 500px;
		margin: 0 auto;
	}

	.middle {
		height: 80%;
	}

	.el-button {
		line-height: 60px;
		border-top-style: 1px solid black;
	}

	.el-aside {
		width: 100px;
		background-color: #d3dce6;
		color: #333;
		text-align: center;
		border-top-style: 2px solid black;
	}

	.el-main {
		background-color: #e9eef3;
		color: #333;
		text-align: center;
		border: 1px solid black;
	}

	.userProfile {
		display: inline-block;
		width: 200px;
		line-height: 60px;
		float: right;
	}

	.el-dropdown {
		height: 45px;
	}

	.el-dropdown-link {
		cursor: pointer;
		color: #409eff;
	}

	.el-icon-arrow-down {
		font-size: 12px;
	}

	.el-dialog {
		align-items: left;
		top: 50%;
		transform: translateY(-50%);
	}

	.votingList {
		width: 100%;
		height: 100%;
		background-color: white;
	}

	.votingListHead {
		width: 100%;
		height: 8%;
		/* background-color: cornflowerblue; */
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid;
	}

	.votingListBody {
		width: 100%;
		background-color: white;
		/* background-color: #42B983; */
	}

	.votingListName {
		width: 21%;
		height: 100%;
		/* background-color: aqua; */
		margin-left: 0px;
		font-size: 16px;
		line-height: 100%;
		display: table;
	}

	.votingListNameWord {
		vertical-align: middle;
		display: table-cell;
	}

	.addVotingRuleButton {
		width: 64%;
		height: 100%;
		/* background: navajowhite; */
		display: table;
		margin-right: 0px;
	}

	.addVotingRuleButtonEntity {
		vertical-align: middle;
		display: table-cell;
	}
</style>
