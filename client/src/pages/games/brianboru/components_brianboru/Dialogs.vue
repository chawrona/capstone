<script setup>
import dialogs from "../../../../../../server/models/games/brianboru/config/dialogs.js";
import useGameDialogs from "../composables_brianboru/useGameDialogs.js";
import ChurchCathedraDialog from "./dialogs/ChurchCathedraDialog.vue";
import ChurchDialog from "./dialogs/ChurchDialog.vue";
import FirstPlayerDialog from "./dialogs/FirstPlayerDialog.vue";
import MarriageDialog from "./dialogs/MarriageDialog.vue";
import MarriageNoRewardDialog from "./dialogs/MarriageNoRewardDialog.vue";
import MarriageRewardCityDialog from "./dialogs/MarriageRewardCityDialog.vue";
import MarriageRewardsDialog from "./dialogs/MarriageRewardsDialog.vue";
import MarriageRewardWinningDialog from "./dialogs/MarriageRewardWinningDialog.vue";
import RejectCardsDialog from "./dialogs/RejectCardsDialog.vue";
import VikingsAttackSomeoneCityDialog from "./dialogs/VikingsAttackSomeoneCityDialog.vue";
import VikingsAttackYourCityDialog from "./dialogs/VikingsAttackYourCityDialog.vue";
import VikingsDialog from "./dialogs/VikingsDialog.vue";
import VikingsInfoDialog from "./dialogs/VikingsInfoDialog.vue";
import VikingsNoAttackDialog from "./dialogs/VikingsNoAttackDialog.vue";
import VikingsRewardsDialog from "./dialogs/VikingsRewardsDialog.vue";

const props = defineProps([
    "gameData",
    "allDialogs",
    "closeDialog",
    "openedDialog",
]);
</script>

<template>
    <!-- <pre>
        {{ "DIALOGI" }}
        {{ allDialogs }}
        {{ "STATUS" }}
        {{ gameData.status }}
        
        {{ "openedDialog" }}
        {{ openedDialog }}
    </pre> -->

    <RejectCardsDialog
        v-if="openedDialog === dialogs.REJECT_CARDS"
        :cards="gameData.cards"
        :phases="gameData.phases"
        :close-dialog="closeDialog"
    />

    <VikingsDialog
        v-if="openedDialog === dialogs.VIKINGS"
        :current-vikings="gameData.currentVikings"
        :close-dialog="closeDialog"
    />
    <VikingsRewardsDialog
        v-if="openedDialog === dialogs.VIKINGS_REWARD"
        :vikings-dialog-info="gameData.vikingsDialogInfo"
        :close-dialog="closeDialog"
    />
    <VikingsInfoDialog
        v-if="openedDialog === dialogs.VIKINGS_ATTACK_INFO"
        :vikings-attack-dialog-info="gameData.vikingsAttackDialogInfo"
        :close-dialog="closeDialog"
    />

    <ChurchDialog
        v-if="openedDialog === dialogs.CHURCH"
        :church-dialog-info="gameData.churchDialogInfo"
        :close-dialog="closeDialog"
    />
    <ChurchCathedraDialog
        v-if="openedDialog === dialogs.BUILD_CATHEDRAL"
        :close-dialog="closeDialog"
    />

    <VikingsNoAttackDialog
        v-if="openedDialog === dialogs.VIKINGS_NO_ATTACK"
        :close-dialog="closeDialog"
    />

    <VikingsAttackSomeoneCityDialog
        v-if="openedDialog === dialogs.VIKINGS_SOMEONE_CITY"
        :vikings-someone-city-info="gameData.vikingsSomeoneCityInfo"
        :close-dialog="closeDialog"
    />
    <VikingsAttackYourCityDialog
        v-if="openedDialog === dialogs.VIKINGS_YOUR_CITY"
        :close-dialog="closeDialog"
    />

    <MarriageDialog
        v-if="openedDialog === dialogs.MARRIAGE"
        :marriage="gameData.marriage"
        :close-dialog="closeDialog"
    />
    <MarriageRewardWinningDialog
        v-if="openedDialog === dialogs.MARRIAGE_REWARD_WINNING"
        :marriage="gameData.marriage"
        :marriage-dialog-info="gameData.marriageDialogInfo"
        :close-dialog="closeDialog"
    />
    <MarriageRewardCityDialog
        v-if="openedDialog === dialogs.MARRIAGE_REWARD_CITY"
        :marriage="gameData.marriage"
        :marriage-dialog-info="gameData.marriageDialogInfo"
        :close-dialog="closeDialog"
    />
    <MarriageRewardsDialog
        v-if="openedDialog === dialogs.MARRIAGE_REWARDS"
        :marriage-dialog-info="gameData.marriageDialogInfo"
        :close-dialog="closeDialog"
    />

    <MarriageNoRewardDialog
        v-if="openedDialog === dialogs.MARRIAGE_NO_WINNER"
        :close-dialog="closeDialog"
    />

    <FirstPlayerDialog
        v-if="openedDialog === dialogs.FIRST_PLAYER"
        :first-player="gameData.firstPlayer"
        :close-dialog="closeDialog"
    />
</template>

<style scoped></style>
