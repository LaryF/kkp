<template>
  <div class="prayer unselectable">
    <p v-for="line in newLines" :key="line.no" v-bind:class="line.markUp">{{line.text}}</p>
  </div>
</template>

<script>
import satBeforeLines from "./info/LDCsat-before.json";
import satAfterLines from "./info/LDCsat-after.json";
import sunBeforeLines from './info/LDCsun-before.json';
import sunAfterLines from './info/LDCsun-after.json';
import commPrayerLines from './info/community-2021-prayer.json';
import protectionLines from "./info/protection.json";
export default {
  name: "PrayerContent",
  props: {
    optionId: Number,
    season: String,
    day: Boolean
  },
  data() {
    return {
      //lines: prayerLines
      groupName:'',
      
    };
  },
  created() {
    if (localStorage.groupName) {
      this.groupName = localStorage.groupName;  //to get a different community name for other community's users
    }
    else
      this.groupName = 'The Sword of the Spirit';
  },
  computed: {
    newLines: function() {
      
      //gets the appropriate prayer as a array; one element for each paragraph
      if(this.day){

        if (this.optionId == 3) {
          const tempArr=JSON.parse(JSON.stringify(satBeforeLines));
          var isAllowed = aLine =>
            !(
              aLine.markUp.charAt(2) == "V" &&
              aLine.markUp.substring(4) != this.season
            );
          tempArr.forEach(aLine => {
            aLine.text = aLine.text.replace("NN", this.groupName);
          });
          return tempArr.filter(isAllowed);
        }

        if (this.optionId == 4) {
          const tempArr=JSON.parse(JSON.stringify(satAfterLines));
          tempArr.forEach(aLine => {
            aLine.text = aLine.text.replace("NN", this.groupName);
          });
          return tempArr;
        }
      }

      if(!this.day) {
        if (this.optionId == 3) {
          return sunBeforeLines;
        }
        if (this.optionId == 4) {
          return sunAfterLines
        }
      }

      if(this.optionId == 5) {
        return commPrayerLines;
      }

      if (this.optionId == 6) {
        return protectionLines;
      }
      return null;
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$emit('change-prayer-id');
    next();
}
};
</script>

<style>
/* styles for displaying prayers*/
@import '../assets/styles/prayerStyles.css';
</style>