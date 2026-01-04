import { ref, onMounted, onBeforeUnmount, computed } from "vue";

import { useAppStore } from "@/store/useAppStore";

import actions from "../actions/actions";

export function useGameDialogs(availableActions) {
    const store = useAppStore();

    const chanceCardDialogOpen = ref(false);
    const chanceCard = ref(null);

    const communityCardDialogOpen = ref(false);
    const communityCard = ref(null);

    const housesDialogOpen = ref(false);
    const houseIndex = ref(0);

    const auctionCardDialogOpen = ref(false);
    const auction = ref(null);

    const mortgagePropertyCardDialogOpen = ref(false);
    const propertyCard = ref(null);

    const openMortgagePropertyCardDialog = (card) => {
        if (
            !availableActions.value.includes(actions.mortgagePropertyCard) &&
            !availableActions.value.includes(actions.redeemPropertyCard)
        )
            return;

        mortgagePropertyCardDialogOpen.value = true;
        propertyCard.value = card;
    };

    const openHouseDialog = (position) => {
        if (
            !availableActions.value.includes(actions.sellHouse) &&
            !availableActions.value.includes(actions.buildHouse)
        )
            return;

        if ([12, 28, 15, 25, 35, 5].includes(position)) return;

        housesDialogOpen.value = true;
        houseIndex.value = position;
    };

    const dialogsOpen = computed(() => {
        return (
            auctionCardDialogOpen.value ||
            communityCardDialogOpen.value ||
            chanceCardDialogOpen.value ||
            mortgagePropertyCardDialogOpen.value ||
            housesDialogOpen.value
        );
    });

    const closeDialogs = () => {
        mortgagePropertyCardDialogOpen.value = false;
        chanceCardDialogOpen.value = false;
        communityCardDialogOpen.value = false;
        auctionCardDialogOpen.value = false;
        housesDialogOpen.value = false;
    };

    onMounted(() => {
        if (!store.socket) return;

        store.socket.on("pickedChanceCard", (chanceCardData) => {
            chanceCard.value = chanceCardData;
            chanceCardDialogOpen.value = true;
        });

        store.socket.on("pickedCommunityCard", (communityCardData) => {
            communityCard.value = communityCardData;
            communityCardDialogOpen.value = true;
        });

        store.socket.on("auction", (auctionData) => {
            auction.value = auctionData;
            auctionCardDialogOpen.value = true;
        });

        store.socket.on("closeDialogs", closeDialogs);
    });

    onBeforeUnmount(() => {
        if (!store.socket) return;

        store.socket.off("pickedChanceCard");
        store.socket.off("pickedCommunityCard");
        store.socket.off("auction");
        store.socket.off("closeDialogs");
    });

    return {
        auction,
        auctionCardDialogOpen,
        chanceCard,
        chanceCardDialogOpen,
        closeDialogs,
        communityCard,
        communityCardDialogOpen,
        dialogsOpen,
        houseIndex,
        housesDialogOpen,
        mortgagePropertyCardDialogOpen,
        openHouseDialog,
        openMortgagePropertyCardDialog,
        propertyCard,
    };
}
