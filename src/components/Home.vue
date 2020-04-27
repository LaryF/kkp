<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      dark
      app>
      <v-list dense>

        <v-treeview
          :items="items"
          hoverable
          activatable
          :open-on-click="true"
          @update:active="getPrayer"
        >
          <template v-slot:prepend="{ item }">
            <v-icon>
              {{ item.icon }}
            </v-icon>
          </template>
        </v-treeview>

      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="primary"
      dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title>Prayer Guide</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-show="(prayerId==3||prayerId==4)" text v-if="sat" @click="setSun()">SAT.</v-btn>
      <v-btn v-show="(prayerId==3||prayerId==4)" text v-else @click="setSat()">SUN.</v-btn>
    </v-app-bar>

    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row v-if= "(prayerId==0||prayerId==undefined)"> <!-- only show in the beginning -->
          <v-col vcols="12">
            <v-row>
              <v-col vcols="12">
                Today is 
                <!-- <span v-for="cel in info.celebrations" :key="cel.title"> -->
                  <span v-if="title.substring(0,5)=='Saint' || title.substring(0,7)=='Blessed'">the feast of </span>
                  {{title}}
                <!-- </span> -->
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col vcol="12" v-for="card in cardItems" :key="card.id">
                <v-card raised :id="card.id" @click="getPrayerBy">
                  <v-card-actions>
                      <v-btn :id="card.id" color="primary" fab x-large dark>
                        <v-icon>{{card.icon}}</v-icon>
                      </v-btn>
                      <v-card-text>{{card.name}}</v-card-text>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <div v-if="prayerId!=0"> <!-- Shows selected prayer -->
          <PrayerContent :key="dialog" :optionId="prayerId" :season="season" :day="sat" :group="groupName"/>
        </div>

      </v-container>
    </v-content>

    <v-footer
      v-bind:color="this.$vuetify.theme.themes.light.primary"
      app
    >
      <span class="white--text">&copy; 2020</span>
      <v-spacer></v-spacer>
      
      <v-btn v-show="(prayerId==3||prayerId==4)" text small @click.stop="dialog2 = true" class="white--text">Guide</v-btn>
      <v-btn v-show="(prayerId==3||prayerId==4)" text small @click.stop="dialog = true" class="white--text">Change grp. name</v-btn>
      
      <v-dialog v-model="dialog" max-width="300"> <!-- dialog -->
        <v-card>
          <v-card-title class="primary white--text">Enter your group name:</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="groupName" class="primary--text" label="Group name" outlined></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="persist" color="primary">Change</v-btn>
          </v-card-actions>
          </v-card>
      </v-dialog>

      <v-dialog v-model="dialog2" max-width="300">
        <v-card>
          <v-card-title class="primary white--text">Guide:</v-card-title>
            <v-card-text>
              <p class="L">Blue text - Leader</p>
              <p class="A">Green text - Assistant</p>
              <p class="G">Black text - Group</p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="dialog2 = false" color="primary">OK</v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>
    </v-footer>
  </v-app>
</template>

<script>
  import PrayerContent from "./PrayerContent"
  
  export default {
    name: "Home",
    components: {
      PrayerContent
    },
    props: {
      source: String,
    },
    mounted () { 
     
      if (localStorage.groupName) {
        this.groupName = localStorage.groupName;  //to get a different community name for other community's users
      }
      else
        this.groupName = 'The Sword of the Spirit';
      
      var neededDate = new Date();
      var weekNo = Math.ceil(neededDate.getDate()/7);
      var romcal = require('romcal');
      var calData = romcal.calendarFor({//loading liturgical info for the day
          country: 'india',
          query: {
            day: neededDate.getDay(), // 0 - Sunday, 6 - Saturday (week beginning with Sunday)
            month: neededDate.getMonth() // 0 - Jan, 11 - Dec (month begining with Jan)
          }
        },
      );
    
      var calInfo = calData[weekNo-1];

      this.title = calInfo.name;

      if(calInfo.data.season.key == 'Holy Week')
        this.season = 'Lent';
      if(calInfo.data.season.key == 'Christmastide')
        this.season = 'Christmas';
      if(calInfo.data.season.key == 'Early Ordinary Time' || calInfo.data.season.key == 'Early Ordinary Time')
        this.season = 'Ordinary';
      else
        this.season = calInfo.data.season.key;

      if(neededDate.getDay()!=0)
      this.sat=true;

      var colour =  calInfo.data.meta.liturgicalColor.key;

      if(colour=='RED') {
        this.$vuetify.theme.themes.light.primary = '#B71C1C';
      }
      else if(colour=='ROSE') {
        this.$vuetify.theme.themes.light.primary = '#F59AB8';
      }
      else if(colour=='PURPLE') {
        this.$vuetify.theme.themes.light.primary = '#E2AB00';
      }
      else if(colour=='GREEN') {
        this.$vuetify.theme.themes.light.primary = '#1B5E20';
      }
      else if(colour=='WHITE') {
        this.$vuetify.theme.themes.light.primary = '#E2AB00';
      }
      else if(colour=='GOLD') {
        this.$vuetify.theme.themes.light.primary = '#E2AB00';
      }
      else 
        this.$vuetify.theme.themes.light.primary = '#3F51B5';

      if(neededDate >= Date.parse("2020/01/18") 
          && Date.parse(neededDate) <= Date.parse("2020/01/25"))
      {
        this.season='unity';
      }
    },

    data: () => ({
      drawer: null,
      items: [
        {
          id: 1,
          name: 'Prayers',
          children: [
            { id: 2, icon:'mdi-glass-wine', name: 'LDC',
              children: [
                          { id:3, icon:'mdi-candle', name:'Before Meal'},
                          { id:4, icon:'mdi-baguette', name:'After Meal'}
                        ]
            },
            { id: 5, icon:'mdi-chess-rook', name: 'Prayer for the year' },
            { id: 6, icon:'mdi-shield-cross-outline', name: 'Prayer for Protection' }
          ],
        }
      ],
      season: '',
      title: '',
      prayerId: 0,
      sat: true, //variable that is true unless the day is Sunday. Saturday's prayer is the default prayer any day except for Sunday
      dialog: false,
      groupName: '',
      dialog2: false
    }),
    computed: {
      cardItems: function() {
        var prefix='';
        function getLeafNodes(nodes, result=[]) {
          
          for(var i=0; i<nodes.length;i++ ){
            if(nodes[i].children){
              prefix = prefix + nodes[i].name + ': ';
              result=getLeafNodes(nodes[i].children, result);
            }else {
              nodes[i].name = prefix + nodes[i].name;
              result.push(nodes[i]);
            }
          }
          prefix=prefix.substring(0, prefix.indexOf(' ')+1);
          return result;
        }
        return getLeafNodes(this.items);
      }
    },
    methods: { 
      getPrayer: function(array) { //gets the prayer id from the treeview
        console.log("prayer", array[0]);
        this.drawer=false; //hides the navigation drawer when a prayer is chosen
        this.prayerId=array[0];
      },
      getPrayerBy: function(e) {
        console.log("prayerz", e);
        this.prayerId=parseInt(e.currentTarget.id);
      },
      setSat() {
        this.sat=true;
      }, 
      setSun() {
        this.sat=false;
      },
      persist() {
        this.dialog = false;
        localStorage.groupName = this.groupName; //to set a different community name for other community's users
      }
    }
  }
</script>