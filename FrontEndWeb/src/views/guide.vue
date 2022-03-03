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
					<div class="userGuide">
						<h2 id="introduction"> 简介</h2>
						<p>当一个问题有多个解决办法方案时，投票是一种最普遍的民主决策方式。当候选项为3个或3个以上时，两两比较候选项时，最后的投票结果可能出现“投票悖论问题”，即投票结果成环，无法确定获胜者。为解决这个问题，研究者们提出了各种投票规则。</p>
						<p>本投票计算平台提供用picat和ASP表示的三种投票规则的程序，用户只要按照格式输入数据，即可根据相应的投票规则计算投票结果。</p>
						<h2 id="introduction">基础投票规则介绍</h2>
						<p>本平台将会提供三个基础的投票规则，分别是</p>
						<ul>
							<li>Borda投票规则</li>
							<li>Slater投票规则</li>
							<li>kemeney投票规则</li>
						</ul>
						<p>下面分别进行介绍</p>
						<h2 id="introduction"> Borda投票规则</h2>
						<p>Borda是基于加权锦标赛的投票规则，加权锦标赛T=(X,A)，是一个有向无环简单图。X为顶点集，表示所有候选项的集合，A表示边集，表示两两候选项之间的偏好关系。每一条边的权重为比较相连的两个候选项的支持人数之差。例如，T中（A,B,2）这条边表示锦标赛中有两个顶点A和B,A>B这条边的权重为2，表示比较候选项A和B,支持A的人数比支持B的人数多2个。</p>
						<p>Borda选举的胜者是borda分数最大的候选项。任意候选项x的Borda分数，borda(X)=X的出度之和-X的入度之和。假设有3个候选项A,B,C,锦标赛T={(A,B,102),{B,C,104},{C,A,98}},则A,B,C的borda分数分别为4，2，-6，则borda(A)最大，候选项A为获胜者。</p>
						<h2 id="introduction"> Slater投票规则</h2>
						<p>Slater投票规则也是基于锦标赛的投票规则，Slater规则的原理就是从一个锦标赛T=(X,A)中选择孔多塞胜者的替代人，这个替代人是通过尽可能少的反转边所形成的严格线性序列的第一位。</p>
						<p>记O是定义在顶点集上的线性序列，T和O之间的距离d(T,O)是T和O中具有不同方向弧的总数。那么在基于X的所有线性序列O所组成的集合中，使得距离d(T,O)最小的线性序列O*称为T的Slater序列。Slater序列不一定是唯一的，但是每一个Slater序列的孔多塞获胜者是唯一的。在锦标赛中任意一个Slater序列的孔多塞获胜者就是T的Slater获胜者。</p>
						<p>假设T={(A,B),(B,C),(C,A)},则有3条严格线性序列，A>B>C,B>C>A和C>A>B和T中不同方向的弧的总数都是1，所以A,B,C都可以是T的slater胜者。</p>
						<h2 id="introduction"> Kemeny投票规则</h2>
						<p>Kemeny规则也是一种基于加权锦标赛的选举方式，相当于Slater规则的加权版本。</p>
						<p>记O是定义在顶点集上的线性序列，T和O之间的权重距离wd(T,O)是T和O中具有不同方向弧的权重之和。那么在基于X的所有线性序列O所组成的集合中，使得距离wd(T,O)最小的线性序列WO*称为T的Keneny序列。Kemeny序列不一定是唯一的，但是每一个Kemeny序列的孔多塞获胜者是唯一的。在锦标赛中任意一个Kemeny序列的孔多塞获胜者就是T的Kemeny获胜者。</p>
						<p>假设T={(A,B,102),{B,C,104},{C,A,98}},则A>B>C是T的kemeny序列，wd(T,WO*)=98最小，则A为T的Kemeny获胜者。</p>
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
		editUserInfo,
		getOnePlantformUser
	} from '@/api/user'

	export default {
		name: "Home",
		components: {},
		data() {
			return {
				user: {
					username: "",
					roles: "",
					introduction: ""
				},
				Showinformation: false,
				resultData: [{
					rule: "Slater",
					language: "/picat",
					result: ""
				}],
				currentRow: null
			};
		},
		mounted(){
			this.user.username = sessionStorage.getItem('userName')
		},
		methods: {
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
			handleCurrentChange(val) {
				this.currentRow = val;
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
	
	.userGuide{
		background-color: white;
		width: 100%;
		height: 150%;
	}
	h2#introduction{
		margin:0px 0px 16px;
		padding:16px 0px 7.2px;
		text-align: left;
		padding-left: 2rem;
		border-bottom: 1px solid;
		
	}
	p{
		display: block;
		text-align: left;
		padding-left: 2rem;
		margin: 0px 0px 16px;
		margin-block-start: 1em;
		margin-block-end: 1em;
		font-size: 16px;
	}
	.userGuide ul{
		padding-left: 4rem;
		margin: 0px 0px 16px;
		margin-block-start: 1em;
		margin-block-end: 1em;
	}
	
	ul li{
		text-align: left;
	}
</style>
