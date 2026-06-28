<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  ChevronsUpDown,
  CircleUser,
  Languages,
  LayoutDashboard,
  LogIn,
  LogOut,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const { fetchSession, logout, user } = useAuth()
const { locale, setLocale, t } = useI18n()
const localePath = useLocalePath()

await fetchSession()

const links = computed(() => [
  { label: t("header.home"), to: localePath("/") },
  { label: t("header.features"), to: localePath({ path: "/", hash: "#features" }) },
  { label: t("header.pricing"), to: localePath({ path: "/", hash: "#pricing" }) },
])

const languageOptions = [
  { code: "en", label: "English", shortLabel: "EN", flag: "🇺🇸" },
  { code: "ru", label: "Русский", shortLabel: "RU", flag: "🇷🇺" },
  { code: "tt", label: "Татарча", shortLabel: "TT", flag: "🇷🇺" },
] as const

type LocaleCode = typeof languageOptions[number]["code"]

const isLocaleCode = (value: string): value is LocaleCode => {
  return languageOptions.some((option) => option.code === value)
}

const currentLocale = computed({
  get: () => locale.value,
  set: (value: string) => {
    if (isLocaleCode(value)) {
      setLocale(value)
    }
  },
})

const profileUser = computed(() => ({
  name: user.value?.name || t("header.account"),
  email: user.value?.email || t("header.signedIn"),
  avatar: user.value?.image || "",
}))

const isLoggedIn = computed(() => Boolean(user.value))

const onLogout = async () => {
  await logout({ redirectTo: localePath("/") })
}
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
    <a href="#content" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground">
      {{ t("header.skipToContent") }}
    </a>
    <div class="relative w-full">
      <div class="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <!-- Left: Logo -->
        <NuxtLink :to="localePath('/')" class="flex items-center gap-3 select-none">
          <span class="grid size-9 place-items-center rounded-lg bg-primary text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/20">
            K
          </span>
          <span class="text-[22px] font-extrabold tracking-tight text-foreground">Kairox AI</span>
        </NuxtLink>

        <!-- Center: Nav -->
        <nav class="mx-auto hidden items-center gap-2 md:flex" :aria-label="t('header.mainNavigation')">
          <NuxtLink
            v-for="l in links"
            :key="l.to"
            :to="l.to"
            class="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            active-class="bg-accent text-accent-foreground"
          >
            {{ l.label }}
          </NuxtLink>
        </nav>

        <!-- Right: language and account -->
        <div class="ml-auto flex items-center gap-2 md:ml-0">
          <Select v-model="currentLocale">
            <SelectTrigger
              size="sm"
              class="h-9 gap-2 border-border/70 bg-secondary/60 px-2.5 shadow-none hover:bg-secondary"
              :aria-label="t('header.language')"
            >
              <Languages class="hidden size-4 text-muted-foreground sm:block" />
              <SelectValue>
                <span class="flex items-center gap-2">
                  <span>{{ languageOptions.find((option) => option.code === currentLocale)?.flag }}</span>
                  <span class="hidden text-sm font-semibold sm:inline">
                    {{ languageOptions.find((option) => option.code === currentLocale)?.shortLabel }}
                  </span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end" class="min-w-40">
              <SelectItem
                v-for="option in languageOptions"
                :key="option.code"
                :value="option.code"
              >
                <span>{{ option.flag }}</span>
                <span>{{ option.label }}</span>
              </SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu v-if="isLoggedIn">
            <DropdownMenuTrigger as-child>
              <Button
                variant="ghost"
                class="h-10 gap-2 rounded-xl bg-secondary/70 px-2 pr-3 hover:bg-secondary active:scale-[0.98]"
              >
                <Avatar class="size-7 rounded-lg">
                  <AvatarImage :src="profileUser.avatar" :alt="profileUser.name" />
                  <AvatarFallback class="rounded-lg">
                    <CircleUser class="size-4" />
                  </AvatarFallback>
                </Avatar>
                <span class="hidden max-w-28 truncate text-sm font-semibold sm:inline">
                  {{ profileUser.name }}
                </span>
                <ChevronsUpDown class="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-64 rounded-xl">
              <DropdownMenuLabel class="p-0 font-normal">
                <div class="flex items-center gap-3 px-2 py-2">
                  <Avatar class="size-9 rounded-lg">
                    <AvatarImage :src="profileUser.avatar" :alt="profileUser.name" />
                    <AvatarFallback class="rounded-lg">
                      <CircleUser class="size-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold">{{ profileUser.name }}</p>
                    <p class="truncate text-xs text-muted-foreground">{{ profileUser.email }}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem as-child>
                  <NuxtLink :to="localePath('/dashboard')">
                    <LayoutDashboard />
                    {{ t("header.dashboard") }}
                  </NuxtLink>
                </DropdownMenuItem>
                <DropdownMenuItem @click="onLogout">
                  <LogOut />
                  {{ t("header.logOut") }}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button v-else as-child size="sm" class="shadow-lg shadow-primary/20 active:scale-[0.98]">
            <NuxtLink :to="localePath('/auth/login')">
              <LogIn class="size-4" />
              {{ t("header.login") }}
              <ArrowRight class="size-4" />
            </NuxtLink>
          </Button>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang='scss' scoped></style>
