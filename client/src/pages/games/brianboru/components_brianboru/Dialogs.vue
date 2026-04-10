<script setup>
import dialogs from "../../../../../../server/models/games/brianboru/config/dialogs.js";
import useGameDialogs from "../composables_brianboru/useGameDialogs.js";
import ChurchCathedraDialog from "./dialogs/ChurchCathedraDialog.vue";
import ChurchDialog from "./dialogs/ChurchDialog.vue";
import EstridRewardDialog from "./dialogs/EstridRewardDialog.vue";
import EstridRewardRegionsDialog from "./dialogs/EstridRewardRegionsDialog.vue";
import EstridRewardVikingsDialog from "./dialogs/EstridRewardVikingsDialog.vue";
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
        :next-player="gameData.nextPlayer"
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

    <EstridRewardDialog
        v-if="openedDialog === dialogs.ESTRID_REWARD_DIALOG"
        :close-dialog="closeDialog"
    />

    <EstridRewardRegionsDialog
        v-if="openedDialog === dialogs.ESTRID_REWARD_REGIONS"
        :close-dialog="closeDialog"
        :marriageDialogInfo="gameData.marriageDialogInfo"
    />

    <EstridRewardVikingsDialog
        v-if="openedDialog === dialogs.ESTRID_REWARD_VIKINGS"
        :close-dialog="closeDialog"
        :marriageDialogInfo="gameData.marriageDialogInfo"
    />
</template>

<style>

.yellowButton {
        border: none;
        height: 40px;
        padding: 0.6rem 2.5rem; 
        font-size: 18px;
        color: #f4eade;
        font-weight: bold;
       
        cursor: pointer;
        background: linear-gradient(to bottom, hsl(43, 35%, 30%), hsl(51, 35%, 28%));
        border-radius: 4px;
        box-shadow: 
            inset 0 0 8px rgba(34, 31, 0, 0.8),
            inset 0 1px 1px rgba(255, 255, 255, 0.1),
            0px 3px 6px rgba(0, 0, 0, 0.6); 
        &:hover {
                   background: linear-gradient(to bottom, hsl(43, 35%, 35%), hsl(51, 35%, 33%));;
        color: #ffffff;
        box-shadow: 
            inset 0 0 8px rgba(41, 38, 1, 0.8),
            inset 0 1px 1px rgba(255, 255, 255, 0.2),
            0px 3px 6px rgba(0, 0, 0, 0.7);
        }
}

.redButton {
    border: none;
    height: 40px;
    padding: 0.6rem 2.5rem; padding-top: 0.65rem;
    font-size: 18px;
    color: #e4e4e4;
 
    cursor: pointer;
    background: linear-gradient(to bottom, #3f1907, #4b0909); 
    border-radius: 4px;
    box-shadow: 
        inset 0 0 8px rgba(139, 74, 74, 0.3), 
        inset 0 1px 1px rgba(122, 6, 6, 0.6), 
        0px 3px 6px rgba(0, 0, 0, 0.6); 

    &:hover {
        background: linear-gradient(to bottom, hsl(19, 80%, 16%), hsl(0, 79%, 18%)); 
        color: #fff;
         box-shadow: 
        inset 0 0 8px rgba(139, 74, 74, 0.3),
        inset 0 1px 1px rgba(122, 6, 6, 0.8),
            0px 3px 6px rgba(0, 0, 0, 0.7)
    }

}

.blueButton {
        border: none;
        height: 40px;
        padding: 0.6rem 2.5rem;
        padding-top: 0.65rem;
        font-size: 18px;
        font-weight: bold;

        cursor: pointer;
        color: #1b1b1b;
        background: linear-gradient(to bottom, #ebebeb, #d1d1d1);
        border-radius: 4px;
        box-shadow: 
            inset 0 0 8px rgba(0, 0, 0, 0.3),
            inset 0 1px 1px rgba(0, 0, 0, 0.6), 
            0px 3px 6px rgba(0, 0, 0, 0.6);
        &:hover {
            background: linear-gradient(to bottom, hsl(0, 0%, 85%), hsl(0, 0%, 75%)); 
                color: #000000; 
        box-shadow: 
            inset 0 0 8px rgba(0, 0, 0, 0.3),
            inset 0 1px 1px rgba(1, 1, 36, 0.6), 
            0px 3px 6px rgba(0, 0, 0, 0.6); 
        }

        &[disabled] {
            color: #555555;
            cursor: not-allowed;
            background: rgb(114, 114, 114);
        }
}
</style>
