<template>
	<div class="page-container">
		<span v-title data-title="投票计算平台"></span>
		<div class="background">
			<img :src="imgSrc" width="100%" height="100%" alt />
		</div>
		<div class="front">
			<div class="register-box">
				<span class="register-title">注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册</span>
				<el-form ref="registerForm" :model="registerForm">
					<el-form-item>
						<span>&nbsp;&nbsp;&nbsp;账号：&nbsp;&nbsp;&nbsp;</span>
						<el-input v-model="registerForm.username" placeholder="用户名" class="register-item" />
					</el-form-item>
					<el-form-item>
						<span>&nbsp;&nbsp;&nbsp;密码：&nbsp;&nbsp;&nbsp;</span>
						<el-input v-model="registerForm.password" type="password" placeholder="密码"
							class="register-item" />
					</el-form-item>
					<el-form-item>
						<span>确认密码：</span>
						<el-input v-model="assure" type="password" placeholder="再次输入密码"
							class="register-item" />
					</el-form-item>
					<el-form-item>
						<el-button class="register-button" plain type="primary" @click="register">注册账号</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		createPlantformUser
	} from '@/api/user'

	export default {
		name: "register",
		data() {
			return {
				registerForm: {
					username: "",
					password: "",
					roles:"user",
					introduction:""
				},
				assure: "",
				imgSrc: require("../assets/Kensett_John_F_Lake_George.jpg")
			};
		},
		methods: {
			register() {
				if(this.registerForm.password !== this.assure){
					this.$message({
						message: '密码输入前后不一致',
						type: 'error'
					});
				}else{
					console.log("@@@注册用户信息",this.registerForm)
					createPlantformUser(this.registerForm).then(response => {
						console.log("注册之后的返回值", response)
						this.$message({
							message: '注册新用户成功',
							type: 'success'
						});
						this.$router.push({ path: "/" }); // 跳转到登录页面
					}).catch(error => {
						console.log(error)
						this.$message({
							message: '注册新用户失败',
							type: 'error'
						});
					})
				}
			},
			// this.$router.push({ path: "/" }); // 跳转到登录页面
		}
	}
</script>

<style scoped>
	.background {
		margin-top: 0%;
		width: 100%;
		height: 100%;
		/**宽高100%是为了图片铺满屏幕 */
		z-index: -1;
		position: absolute;
	}

	.front {
		z-index: 1;
		position: absolute;
	}

	.register-box {
		padding-top: 20px;
		height: 350px;
		width: 320px;
		position: fixed;
		top: 20%;
		left: 50%;
		margin-left: -150px;
		border: rgb(132, 182, 216) 1px solid;
		box-shadow: 10px 10px 5px #888888;
		background-color: rgb(255, 255, 255);
	}

	.register-title {
		display: block;
		height: 60px;
		line-height: 45px;
		font-size: 24px;
		font-weight: 500;
	}

	.register-item {
		width: 200px;
	}

	.register-button {
		width: 80%;
	}
</style>
