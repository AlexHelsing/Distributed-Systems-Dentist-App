# Dentist Booking System frontend

Welcome to our Frontend Dentist Booking System, an innovative and user-friendly application designed for efficient dental appointment management across Sweden. This system streamlines the process of finding and booking dental appointments, ensuring a seamless experience for users.

## Description

This is the frontend for dentist appointment booking system which allows users to book appointments with dentists/clinics across sweden. Clinics can be viewed on a map where the user can see availible timeslots, the timeslots are updated in realtime if someone books an appointment, a dentist posts new slot or removes a slot.

## Technologies used

- Vite
- Vue
- Typescript
- Tailwind CSS
- Pusher-js
- Tanstack Query
- Vue-router
- Shadcn
- Zod

## Interface and features

|                  Mapview                   |                    Mapview dark                    |
| :----------------------------------------: | :------------------------------------------------: |
| ![image](/src/assets/mapviewscrenshot.png) | ![image](/src/assets/mapviewdarkmodescreenhot.png) |

|              Dashboard              |             Dashboard dark              |
| :---------------------------------: | :-------------------------------------: |
| ![image](/src/assets/dashboard.png) | ![image](/src/assets/dashboarddark.png) |

|             Edit account              |             Edit account dark             |
| :-----------------------------------: | :---------------------------------------: |
| ![image](/src/assets/editaccount.png) | ![image](/src/assets/editaccountdark.png) |

|       Cancel notification from dentist       |  Cancel notification from dentist dark   |
| :------------------------------------------: | :--------------------------------------: |
| ![image](/src/assets/reltimecancellight.png) | ![image](/src/assets/realtimeCancel.png) |

|             Confirm booking              |            Confirm booking dark            |
| :--------------------------------------: | :----------------------------------------: |
| ![image](/src/assets/confirm%20page.png) | ![image](/src/assets/confirmpagelight.png) |

|            Sign in             |             Sign in dark             |
| :----------------------------: | :----------------------------------: |
| ![image](/src/assets/auth.png) | ![image](/src/assets/signindark.png) |

|             Sign up              |                  Sign up dark                  |
| :------------------------------: | :--------------------------------------------: |
| ![image](/src/assets/signup.png) | ![image](/src/assets/auth%20signup%20dark.png) |

### Installation guide

### 1. Set up each of the microservices and gateways

See information in the README.md files in each of the microservices and gateways.

### 2. Set up the frontend

```bash
git clone 'repo link'
cd 'repo name
npm install
npm run dev
```

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
