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
					<el-table :data="tableData" style="width: 100%">
						<el-table-column prop="index" label="序号" width="100">
						</el-table-column>
						<el-table-column prop="ruleName" label="投票规则名称" width="180">
						</el-table-column>
						<el-table-column prop="language" label="规则表示语言" width="120">
						</el-table-column>
						<el-table-column  prop="computeResult" label="计算结果" width="400">
							<template slot-scope="scope">
								<el-input  v-model="tableData[scope.$index].computeResult" type="textarea" rows="5"
									style="margin-top:5px auto" />
							</template>
						</el-table-column>
						<el-table-column label="操作" width="80">
							<template slot-scope="scope">
								<el-button size="mini" type="danger" @click="deleteVotingResult(scope.row)">删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage"
						:page-size="pageSize" layout="prev, pager, next, jumper" :total="total">
					</el-pagination>
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
								<el-input v-model="user.introduction" type="textarea" maxlength="256" show-word-limit
									rows="5" style="margin-top:5px auto" placeholder="在此填写" />
							</el-form-item>
							<el-form-item>
								<el-button @click="saveinformation()">保存修改</el-button>
								<el-button @click="Showinformation=false">取消修改</el-button>
							</el-form-item>
						</el-form>
					</el-dialog>
				</el-main>
				<el-aside class="rightAside">rightAside</el-aside>
			</el-container>
		</el-container>
		<router-view />
	</div>
</template>

<script>
	// @ is an alias to /src
	// import HelloWorld from '@/components/HelloWorld.vue'

	import {
		editUserInfo,
		getOnePlantformUser
	} from '@/api/user'
	import {
		getVotingResultList,
		updateVotingResult
	} from '@/api/votingResult'
	export default {
		name: "Home",
		components: {},
		data() {
			return {
				user: {
					username: "",
					roles: "",
					introduction: "",
					userId: ""
				},
				Showinformation: false,
				tableData: [],
				currentRow: null,
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
		},
		methods: {
			initData() {
				this.user.userId = this.$store.state.user.id
				// console.log("this.user.userId:",this.user.userId)
				this.getVotingResultList();
				// this.getVotingResultListCount();
			},
			getVotingResultList() {
				getVotingResultList({
					filter: {
						where: {
							and: [{
								isDelete: 0
							}, {
								userId: this.user.userId
							}]
						},
						fields: {
							ruleName: true,
							language: true,
							isDelete: true,
							computeResult: true,
							userId: true,
							id: true
						},
						limit: this.pageSize,
						skip: (this.currentPage - 1) * this.pageSize
					}
				}).then(response => {
					console.log("response", response)
					this.total = response.length;
					var votingResultArray = new Array()
					for (var i = 0; i < response.length; i++) {
						votingResultArray[i] = response[i]
						votingResultArray[i].index = i + 1
					}
					console.log("获取的数据", votingResultArray)
					this.tableData = votingResultArray
					console.log("this.tableData[0].computeResult:",this.tableData[0].computeResult)

				}).catch(error => {
					console.log(error)
				})
				// console.log(this.form)
			},
			deleteVotingResult(votingResult) {
				console.log("被选中的投票结果", votingResult)
				this.$confirm('此操作将删除该投票结果, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var _votingResult = votingResult
					_votingResult.isDelete = 1
					updateVotingResult(_votingResult).then(response => {
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
			quit() {
				this.$router.push({
					path: "/"
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
			delresult() {},
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
			setCurrent(row) {
				this.$refs.singleTable.setCurrentRow(row);
				this.$router.push({
					path: "/vote"
				});
			},
			handleCurrentChange(currentPage) {
				console.log(`当前页: ${currentPage}`);
				this.currentPage = currentPage
				this.getVotingResultList(this.currentPage, this.pageSize)
			}
		}
	};
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
		height: 60px;
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
		height: 880px;
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
	
	.el-aside rightAside {
		width: 100px;
		background-color: #d3dce6;
		color: #333;
		text-align: center;
		border-top-style: 2px solid black;
	}
</style>
