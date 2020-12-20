// https://umijs.org/config/
import { defineConfig } from 'umi'
import defaultSettings from './defaultSettings'
import proxy from './proxy'

// const { REACT_APP_ENV } = process.env
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'register-result',
              path: '/user/register-result',
              component: './user/register-result',
            },
            {
              name: 'register',
              path: '/user/register',
              component: './user/register',
            },
            {
              name: 'Login',
              icon: 'smile',
              path: '/user/login',
              component: './user/Login',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          Routes: ['src/pages/Authorized'],
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/course',
            },
            {
              name: '课程模块',
              path: '/course',
              icon: 'dashboard',
              routes: [
                {
                  path: '/',
                  redirect: '/course/course-list',
                },
                {
                  name: '课程列表',
                  icon: 'smile',
                  path: '/course/course-list',
                  component: './course/course-list',
                },
                {
                  name: '课程编辑',
                  icon: 'smile',
                  path: '/course/course-edit/courseID=:courseID&',
                  component: './course/course-edit',
                },
                {
                  name: '绑定教师',
                  icon: 'smile',
                  path: '/course/course-bind',
                  component: './course/course-bind',
                },
              ],
            },
            {
              path: '/grade',
              name: '成绩模块',
              icon: 'dashboard',
              routes: [
                {
                  path: '/',
                  redirect: '/grade/analysis',
                },
                {
                  name: '成绩看板',
                  icon: 'smile',
                  path: '/grade/analysis',
                  component: './dashboard/teacherDashboard',
                },
                {
                  name: '我的成绩',
                  icon: 'smile',
                  path: '/grade/mygrade',
                  component: './dashboard/studentDashboard',
                },
              ],
            },
            {
              name: '作业',
              icon: 'highlight',
              path: '/homework',
              routes: [
              ],
            },
            {
              name: '实验',
              icon: 'cluster',
              path: '/labs',
              authority: ['teacher', 'student'],
              routes: [
                {
                  path: '/',
                  redirect: '/labs',
                  authority: ['student'],
                },
                {
                  name: '实验列表',
                  path: '/labs/list',
                  component: './labs/student/LabTable', 
                  authority: ['teacher', 'student'],
                },
                {
                  name: '实验详情',
                  path: '/labs/lab',
                  hideInMenu: true,
                  component: './labs/student/Lab', 
                  authority: ['student'],
                },
                {
                  name: '创建实验',
                  path: '/labs/create',
                  hideInMenu: true,
                  component: './labs/teacher/CreateLab', 
                  authority: ['teacher'],
                },
                {
                  name: '实验分析页',
                  icon: 'smile',
                  path: '/labs/analyse',
                  component: './labs/teacher/AnalyseLab',
                  authority: ['teacher'],
                },
                {
                  name: '提交列表',
                  icon: 'smile',
                  path: '/labs/pending-list',
                  hideInMenu: true,
                  component: './labs/teacher/PendingList',
                  authority: ['teacher'],
                },
                {
                  name: '批改实验',
                  path: '/labs/mark',
                  hideInMenu: true,
                  component: './labs/teacher/MarkLab',
                  authority: ['teacher'],
                },
                {
                  name: '所有实验',
                  path: '/labs/all',
                  hideInMenu: true,
                  component: './labs/teacher/AllLabList',
                  authority: ['teacher'],
                },
              ],
            },
            {
              name: '对抗系统',
              icon: 'aim',
              path: '/contest',
              authority: ['teacher', 'student'],
              routes: [
                {
                  name: '历史记录',
                  path: '/contest/histroy',
                  component: './contest/student/MatchHistory',
                  authority: ['student'],
                },
                {
                  name: '参加比赛',
                  path: '/contest/match',
                  component: './contest/student/Contest',
                  authority: ['student'],
                },
                {
                  name: '查看成绩',
                  path: '/contest/match-history',
                  component: './contest/teacher/MatchHistory',
                  authority: ['teacher'],
                },
                {
                  name: '创建比赛',
                  path: '/contest/create-contest',
                  component: './contest/teacher/CreateContest',
                  authority: ['teacher'],
                },
                {
                  name: '对抗题库',
                  path: '/contest/questions-bank',
                  component: './contest/teacher/QuestionBank',
                  authority: ['teacher'],
                },
              ],
            },
            {
              name: '资料库',
              icon: 'table',
              path: '/storehouse',
              component: './storehouse/Overview',
              authority: ['teacher'],
            },
            {
              path: '/announcement',
              name: '公告',
              icon: 'profile',
              routes: [
                {
                  name: '公告列表',
                  path: '/announcement/anc-list',
                  component: './announcement/teacher/AncList',
                },
                {
                  name: '公告详情',
                  path: '/announcement/anc-list/anc-info',
                  hideInMenu: true,
                  component: './announcement/teacher/AncInfo',
                },
                {
                  name: '编辑公告',
                  path: '/announcement/anc-list/anc-edit',
                  hideInMenu: true,
                  component: './announcement/teacher/AncEdit',
                },
              ],
            },
            {
              name: '用户系统',
              icon: 'user',
              path: '/account',
              routes: [
                {
                  path: '/',
                  redirect: '/account/center',
                },
                // {
                //   name: 'center',
                //   icon: 'smile',
                //   path: '/account/center',
                //   component: './account/center',
                // },
                {
                  name: '账号设置',
                  icon: 'smile',
                  path: '/account/settings',
                  component: './account/settings',
                },
                {
                  name: '导入单个账号',
                  icon: 'smile',
                  path: '/account/import',
                  component: './account/bulkimport',
                },
                {
                  name: '批量导入账号',
                  icon: 'smile',
                  path: '/account/bulkimport',
                  component: './account/bulkimport',
                },
              ],
            },
            {
              component: '404',
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  // proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Proxy for integrated test
  proxy: {
    '/api/v1': {
      // target: 'http://localhost:8000',
      target: 'http://192.168.106.128:8000',
      changeOrigin: true,
    },
  },
})
