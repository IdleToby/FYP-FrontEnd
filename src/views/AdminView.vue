<template>
  <div>
    <el-container>
      <el-aside style="height: 100vh; background-color: #001529">
        <div
          style="
            height: 60px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <span class="logo-title">Management System</span>
        </div>
        <el-menu
          :router="true"
          background-color="#001529"
          text-color="rgba(255, 255, 255, 0.65)"
          active-text-color="#fff"
          style="border: none"
          :default-active="activeIndex"
          @select="handleSelect"
        >
          <el-menu-item index="/admin/userManagement"
            ><span class="p-4">User Management</span></el-menu-item
          >
          <el-menu-item index="/admin/postManagement"
            ><span class="p-4">Post Management</span></el-menu-item
          >
          <el-menu-item index="/admin/newsManagement"
            ><span class="p-4">News Management</span></el-menu-item
          >

          <div class=" mt-8">
            <el-menu-item index="/frontPage"><span class=" text-red-600">Front Page</span></el-menu-item>
            <el-menu-item @click="logout"><span class=" text-red-600">Logout</span></el-menu-item>
          </div>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouterView } from 'vue-router'

onMounted(() => {
  if (!localStorage.getItem('user')) {
    router.push('/login')
    ElMessage.error('Please login first')
  }
  router.push('/admin/userManagement')
})

const router = useRouter()

const activeIndex = ref('/admin/userManagement')
const handleSelect = (key) => {
  activeIndex.value = key
}

function logout() {
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
.el-menu--inline {
  background-color: #000c17 !important;
}

.el-menu--inline .el-menu-item {
  background-color: #000c17 !important;
  padding-left: 49px !important;
}

.el-menu-item:hover,
.el-submenu__title:hover {
  color: #fff !important;
}

.el-submenu__title:hover i {
  color: #fff !important;
}

.el-menu-item:hover i {
  color: #fff !important;
}

.el-menu-item.is-active {
  background-color: #1890ff !important;
  border-radius: 5px !important;
  width: calc(100% - 8px);
  margin-left: 4px;
}

.el-menu-item.is-active i,
.el-menu-item.is-active .el-tooltip {
  margin-left: -4px;
}

.el-menu-item {
  height: 40px !important;
  line-height: 40px !important;
}

.el-submenu__title {
  height: 40px !important;
  line-height: 40px !important;
}

.el-submenu .el-menu-item {
  min-width: 0 !important;
}

.el-menu--inline .el-menu-item.is-active {
  padding-left: 45px !important;
}

/*.el-submenu__icon-arrow {*/
/*  margin-top: -5px;*/
/*}*/

.el-aside {
  transition: width 0.3s;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
}

.logo-title {
  margin-left: 5px;
  font-size: 20px;
  transition: all 0.3s;
  /* 0.3s */
}

.el-header {
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  display: flex;
  align-items: center;
}
</style>
