<script setup lang="ts">
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  CircleUser
} from "lucide-vue-next"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from '@/components/ui/badge'

const { data: userData, status } = await useFetch("/api/user", { 
	key: "userData"
})

import { useAuth } from "@/composables/auth-client"

const { logout } = useAuth()
const { t } = useI18n()
const localePath = useLocalePath()

const props = defineProps<{
  user: {
    name: string
    email: string
    avatar?: string | null
  }
}>()

const { isMobile, toggleSidebar  } = useSidebar()

const onClick = async () => {
	await logout({
		redirectTo: localePath("/auth/login")
	})
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="user.avatar || ''" :alt="user.name" />
              <AvatarFallback class="rounded-lg">
                <CircleUser/>
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ user.name }}</span>
              <span class="truncate text-xs">{{ user.email }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="start"
          :side-offset="15"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="user.avatar || ''" :alt="user.name" />
                <AvatarFallback class="rounded-lg">
                  <CircleUser/>
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ user.name }}</span>
                <span class="truncate text-xs">{{ user.email }}</span>
              </div>
				  <Badge v-if="userData && userData.subscription">Pro</Badge>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <!-- <DropdownMenuGroup>
            <DropdownMenuItem>
              <Sparkles />
              Upgrade to Pro
            </DropdownMenuItem>
          </DropdownMenuGroup> -->
          <!-- <DropdownMenuSeparator /> -->
          <DropdownMenuGroup>
            <DropdownMenuItem as-child>
              <NuxtLink :to="localePath('/dashboard/settings')">
                <CreditCard />
                {{ t("common.billing") }}
              </NuxtLink>
            </DropdownMenuItem>
            <!-- <DropdownMenuItem>
              <Bell />
              Notifications
            </DropdownMenuItem> -->
          </DropdownMenuGroup>
          <!-- <DropdownMenuSeparator /> -->
          <DropdownMenuItem @click="onClick">
            <LogOut />
            {{ t("header.logOut") }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
