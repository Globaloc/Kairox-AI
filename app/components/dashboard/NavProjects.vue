<script setup lang="ts">
import type { LucideIcon } from "lucide-vue-next"
import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
} from "lucide-vue-next"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

type ProjectsItem = {
  title: string
  url: string
  icon?: LucideIcon
}

type ProjectsGroup = {
  label: string
  show?: boolean
  items: ProjectsItem[]
}

withDefaults(defineProps<{
  menuGroups: ProjectsGroup[]
}>(), {
  menuGroups: () => [{ label: '', show:false, items: [] }]
})

const { isMobile } = useSidebar()
const route = useRoute()
const { t } = useI18n()
</script>

<template>
  <SidebarGroup v-for="(group, groupIndex) in menuGroups" :key="groupIndex" class="py-0 group-data-[collapsible=icon]:py-2">
    <SidebarGroupLabel class="group-data-[collapsible=icon]:pointer-events-none h-6">{{ group.label }}</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem v-for="item in group.items" :key="item.title">
        <SidebarMenuButton as-child :tooltip="item.title" class="min-h-10" :is-active="route.path === item.url">
          <NuxtLink :to="item.url">
            <component :is="item.icon" v-if="item.icon"/>
            <span>{{ item.title }}</span>
          </NuxtLink>
        </SidebarMenuButton>
        <DropdownMenu >
          <DropdownMenuTrigger class="[&>svg]:size-5 top-2.5!" as-child>
            <SidebarMenuAction show-on-hover>
              <MoreHorizontal />
              <span class="sr-only">{{ t("common.more") }}</span>
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            class="w-48 rounded-lg"
            :side="isMobile ? 'bottom' : 'right'"
            :align="isMobile ? 'end' : 'start'"
          >
            <DropdownMenuItem>
              <Folder class="text-muted-foreground" />
              <span>{{ t("dashboardNav.actions.view") }}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Forward class="text-muted-foreground" />
              <span>{{ t("dashboardNav.actions.share") }}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Trash2 class="text-muted-foreground" />
              <span>{{ t("dashboardNav.actions.delete") }}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <SidebarMenuItem v-if="group.show">
        <SidebarMenuButton class="text-sidebar-foreground/70">
          <MoreHorizontal class="text-sidebar-foreground/70" />
          <span>{{ t("common.more") }}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
