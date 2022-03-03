<template>
	<div class="page-container">
		<span v-title data-title="投票计算平台"></span>
		<div class="background">
			<img :src="imgSrc" width="100%" height="100%" alt />
		</div>
		<div class="front">
			<div class="login-box">
				<span class="login-title">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</span>
				<el-form ref="loginForm" :model="loginForm" :rules="loginRules">
					<el-form-item>
						<span>用户名：</span>
						<el-input v-model="loginForm.username" placeholder="用户名" class="login-item" />
					</el-form-item>
					<el-form-item>
						<span>密码：</span>
						<el-input v-model="loginForm.password" type="password" placeholder="密码" class="login-item" />
					</el-form-item>
					<el-form-item>
						<el-button :loading="loading" class="login-button" plain type="primary" @click="login">登录
						</el-button>
					</el-form-item>
					<el-form-item>
						<el-button class="register-button" plain type="primary" @click="register">新用户？&lt;注册账号&gt;
						</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	// import { encrypt } from "@/utils/aes";
	// import { login } from "../utils/api";
	import {
		validUsername
	} from '@/utils/validate'
	export default {
		name: "Login",
		data() {
			const validateUsername = (rule, value, callback) => {
				if (!validUsername(value)) {
					callback(new Error('Please enter the correct user name'))
				} else {
					callback()
				}
			}
			const validatePassword = (rule, value, callback) => {
				if (value.length < 6) {
					callback(new Error('The password can not be less than 6 digits'))
				} else {
					callback()
				}
			}
			return {
				loginForm: {
					username: '',
					password: ''
				},
				loginRules: {
					username: [{
						required: true,
						trigger: 'blur',
						validator: validateUsername
					}],
					password: [{
						required: true,
						trigger: 'blur',
						validator: validatePassword
					}]
				},
				imgSrc: require("../assets/Kensett_John_F_Lake_George.jpg"),
				loading: false
			};
		},
		methods: {
			login() {
				this.$refs.loginForm.validate(valid => {
					if (valid) {
						this.loading = true
						this.$store.dispatch('user/login', this.loginForm)
							.then(() => {
								sessionStorage.setItem('userName',this.loginForm.username);
								sessionStorage.setItem('user',JSON.stringify(this.$store.state.user))
								this.$store.dispatch('user/setUser',this.loginForm.username);
								this.$router.push({
									path: "/home"
								});
								this.loading = false
							})
							.catch(() => {
								this.loading = false
							})
					} else {
						console.log('error submit!!')
						return false
					}
				})
			},
			// this.$router.push({ path: "/home" }); // 跳转页面
			register() {
				this.$router.push({
					path: "/register"
				}); // 跳转到注册页面
			}
		}
	};
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

	.login-box {
		padding-top: 20px;
		height: 350px;
		width: 300px;
		position: fixed;
		top: 20%;
		left: 50%;
		margin-left: -150px;
		border: rgb(132, 182, 216) 1px solid;
		box-shadow: 10px 10px 5px #888888;
		background-color: rgb(255, 255, 255);
	}

	.login-title {
		display: block;
		height: 60px;
		line-height: 45px;
		font-size: 24px;
		font-weight: 500;
	}

	.login-item {
		width: 200px;
	}

	.login-button {
		width: 80%;
	}

	.register-button {
		width: 80%;
	}
</style>
