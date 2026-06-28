export const useUpgradeDialog = () => {
	const isUpgradeDialogOpen = useState("upgrade-dialog-open", () => false);
	const upgradeDialogMessage = useState(
		"upgrade-dialog-message",
		() => "",
	);

	const openUpgradeDialog = (message?: string) => {
		upgradeDialogMessage.value = message || "";
		isUpgradeDialogOpen.value = true;
	};

	const closeUpgradeDialog = () => {
		isUpgradeDialogOpen.value = false;
	};

	return {
		closeUpgradeDialog,
		isUpgradeDialogOpen,
		openUpgradeDialog,
		upgradeDialogMessage,
	};
};
