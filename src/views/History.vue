<template>
  <div class="history">
    <section class="hero is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            <b-icon icon="history" size="is-medium"></b-icon>
            <span>&nbsp;Winners History</span>
          </h1>
          <h2 class="subtitle">You can also see the video of Winner's history in Browser.</h2>
        </div>
      </div>
    </section>
    <br />
    <div class="container section">
      <table
        class="table is-bordered is-striped is-hoverable is-fullwidth"
        v-if="allVideoData.length != 0"
      >
        <tbody>
          <tr v-for="(item, index) in allVideoData" :key="item.id">
            <td>
              <img :src="item.video_object.thum" alt="Video Thumbnail" style="width: 253px;" />
            </td>
            <td>
              <p
                class="has-text-centered"
                style="padding-bottom: 6px;font-size: 15px;font-family: unset;"
              >
                <a
                  :href="'https://www.youtube.com/watch?v='+item.video_object.id"
                  target="_blank"
                >{{ item.video_object.tile }}</a>
              </p>
              <nav class="level is-mobile">
                <!-- Left side -->
                <div class="level-left">
                  <div class="level-item">
                    <p class="level-item">
                      <b-tooltip type="is-success" label="Choose Another Winner" position="is-left">
                        <router-link
                          class="button is-success"
                          :to="{ name: 'Picker', params: { id: item.video_object.id } }"
                        >
                          <b-icon icon="trophy"></b-icon>
                        </router-link>
                      </b-tooltip>
                    </p>
                  </div>
                </div>
                <!-- Right side -->
                <div class="level-right">
                  <p class="level-item">
                    <b-tooltip type="is-primary" label="Copy Video Link" position="is-left">
                      <button
                        class="button is-info"
                        v-clipboard="'https://www.youtube.com/watch?v='+item.video_object.id"
                        @success="handleSuccess"
                        @error="handleError"
                      >
                        <b-icon icon="content-copy"></b-icon>
                      </button>
                    </b-tooltip>
                  </p>
                  <p class="level-item">
                    <b-tooltip type="is-danger" label="Delete" position="is-left">
                      <button
                        class="button is-danger"
                        @click="deleteVideoAllData(item.video_object.id, index)"
                      >
                        <b-icon icon="trash-can-outline"></b-icon>
                      </button>
                    </b-tooltip>
                  </p>
                </div>
              </nav>
              <div class="box">
                <nav class="level">
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading" title="Video Winners">
                        <span>WINNERS</span>
                      </p>
                      <p class="title is-4" v-if="(item.winners.length == 0)">0</p>
                      <p class="title is-4" v-else>
                        <a @click="showVideoWinners(item.winners)">{{ item.winners.length }}</a>
                      </p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading" title="Unique Users">Unique Users</p>
                      <p class="title is-4">{{ item.unique_users }}</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading" title="Video Comments">Comments</p>
                      <p
                        class="title is-4"
                        v-bind:class="{ 'has-text-success': item.status }"
                      >{{ item.video_object.comms }}</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading" title="Video View">View</p>
                      <p class="title is-4">{{ item.video_object.view }}</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading" title="Video Likes">Likes</p>
                      <p class="title is-4">{{ item.video_object.like }}</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading" title="Video Dislikes">Dislikes</p>
                      <p class="title is-4">{{ item.video_object.dlike }}</p>
                    </div>
                  </div>
                </nav>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- History Not Found! -->
      <div class="columns is-mobile is-centered" v-else>
        <div class="column has-text-centered">
          <h1 class="title is-2 has-text-danger" style="padding: 0px 0px 4px;">&nbsp; History Not Found!</h1>
          <h2 class="subtitle is-5">
            Go to
            <router-link to="/">&nbsp;Home Page</router-link>
          </h2>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
    <!-- Video Winners Data for indexedDB -->
    <b-modal :active.sync="isWinnersModel" :width="640" scroll="keep">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">
            <b-icon icon="trophy"></b-icon>
            <span>&nbsp; Winners List</span>
          </p>
        </header>
        <section class="modal-card-body">
          <article class="media" v-for="(item, index) in winnersData" :key="index">
            <figure class="media-left">
              <p class="image is-64x64">
                <img :src="item.winner_object.winner_purl" />
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>
                    <a
                      :href="item.winner_object.winner_curl"
                      target="_blank"
                    >{{ item.winner_object.winner_name }}</a>
                  </strong>
                  <small>
                    &nbsp;
                    <b-tooltip :label="'Total Comment: '+ item.winner_object.tcomm" position="is-bottom">
                      @comment: {{ item.winner_object.tcomm }}
                    </b-tooltip>
                  </small>
                  <br />
                  <small v-for="(comment, index) in item.winner_object.comments" :key="index">
                    * {{ comment.cmnt }} <br />
                  </small>
                </p>
              </div>
              <nav class="level is-mobile">
                <div class="level-left">
                  <a class="level-item">
                    <span class="icon is-small">
                      <i class="fas fa-reply"></i>
                    </span>
                  </a>
                  <a class="level-item">
                    <span class="icon is-small">
                      <i class="fas fa-retweet"></i>
                    </span>
                  </a>
                  <a class="level-item">
                    <span class="icon is-small">
                      <i class="fas fa-heart"></i>
                    </span>
                  </a>
                </div>
              </nav>
            </div>
            <div class="media-right">
              <b-tooltip type="is-danger" label="Delete Winner" position="is-left">
                <button class="button is-danger is-small" @click="winnerDataDelete(item.id, index)">
                  <b-icon icon="delete" custom-size="mdi-18px"></b-icon>
                </button>
              </b-tooltip>
            </div>
          </article>
        </section>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import Dexie from "dexie";

import VueClipboards from "vue-clipboards";
Vue.use(VueClipboards);

var numeral = require("numeral");

import Footer from "@/components/Footer"

export default {
  name: "History",
  metaInfo: {
    title: "History",
    titleTemplate: "%s - YouTube Comment Picker V3",
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  components: {
    "app-footer": Footer
  },
  data() {
    return {
      // IndexedDB Data
      db: {
        winnerTable: "youtube-comment-picker-v3-winners",
        winnerTableObj: false
      },
      allVideoData: [],
      isWinnersModel: false,
      winnersData: false
    };
  },
  methods: {
    /**
     * Init
     */
    init: function() {
      var that = this;
      this.allVideoData = [];

      // Fetch All indexedDB database names
      this.fetchDatabasesName().then(
        function(database) {
          if (database.length != 0) {
            database.forEach(name => {
              // without `winnerdb` database name
              if (name != that.db.winnerTable) {
                // store video winner in this variable
                var videoWinner = [];

                // open video table
                that
                  .openVideoTable(name)
                  .then(function(db) {
                    // fetch video information in the indexedDB table
                    db.info
                      .get(1)
                      .then(function(videoData) {
                        if (videoData != undefined) {
                          // if video status true
                          if (videoData.status === true) {
                            that.db.winnerTableObj.winnerdb
                              .where("video_id")
                              .equalsIgnoreCase(name)
                              .toArray(function(data) {
                                if (data.length != 0) {
                                  data.forEach(element => {
                                    videoWinner.push(element);
                                  });
                                }
                              });
                          }

                          var allData = {
                            active_comments: videoData.active_comments,
                            status: videoData.status,
                            unique_users: videoData.unique_users,
                            video_object: {
                              id: videoData.video_object.id,
                              tile: videoData.video_object.tile,
                              thum: videoData.video_object.thum,
                              chid: videoData.video_object.chid,
                              comms: numeral(
                                videoData.video_object.comms
                              ).format("0a"),
                              like: numeral(videoData.video_object.like).format(
                                "0a"
                              ),
                              dlike: numeral(
                                videoData.video_object.dlike
                              ).format("0a"),
                              view: numeral(videoData.video_object.view).format(
                                "0a"
                              ),
                              pudt: numeral(videoData.video_object.pudt).format(
                                "0a"
                              )
                            },
                            winners: videoWinner
                          };

                          // store video info and video winner data
                          that.allVideoData.push(allData);
                        } else {
                          console.error("Video Information Not Found!");
                        }
                      })
                      .catch(Dexie.BulkError, function(e) {
                        console.error(e);
                      });
                  })
                  .catch(function(err) {
                    console.error("Failed to open db: " + (err.stack || err));
                  });
              }
            });
          }
        },
        function(error) {
          console.error("Failed!", error);
        }
      );
    },

    /**
     * Show all winner
     * @param: winner data
     */
    showVideoWinners: function(winnerData) {
      this.winnersData = winnerData;
      this.isWinnersModel = true;
    },

    /**
     * Delete Winner Data
     * @param: winner id
     */
    winnerDataDelete: function(winner_id, index) {
      var that = this;

      this.$buefy.dialog.confirm({
        title: "Deleting Winner",
        message:
          "Are you sure you want to <b>delete</b> video winner? This action cannot be undone.",
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        onConfirm: function() {
          // delete winner for id
          that.db.winnerTableObj.winnerdb
            .delete(winner_id)
            .then(function() {
              that.winnersData.splice(index, 1);
              // show success toast
              that.$buefy.toast.open({
                duration: 5000,
                position: "is-bottom",
                message: "Video Winner has been deleted successfully.",
                type: "is-success"
              });
            })
            .catch(function(e) {
              console.warn(e);
            });
        }
      });
    },

    /**
     * Video ALL Data Delete
     * @param: video_id
     */
    deleteVideoAllData: function(database_name, index) {
      var that = this;

      // open database using video id
      this.openVideoTable(database_name)
        .then(function(db) {
          // exists database
          // show confirm box
          that.$buefy.dialog.confirm({
            title: "Delete",
            message:
              "Are you sure you want to <b>delete</b> video all data? This action cannot be undone.",
            confirmText: "Delete",
            type: "is-danger",
            hasIcon: true,
            onConfirm: function() {
              // start full page loading
              var loadingComponent = that.$buefy.loading.open();

              // delete winners for video id
              that.db.winnerTableObj.winnerdb
                .where("video_id")
                .equalsIgnoreCase(database_name)
                .toArray(function(winners) {
                  if (winners.length != 0) {
                    winners.forEach(function(item) {
                      if (item["id"] != undefined)
                        that.db.winnerTableObj.winnerdb.delete(item["id"]);
                    });
                  }
                });

              // delete table
              db.delete()
                .then(() => {
                  // end full page loading
                  loadingComponent.close();
                  console.warn(
                    "Database successfully deleted: " + database_name
                  );

                  that.allVideoData.splice(index, 1);
                })
                .catch(err => {
                  console.error("Could not delete database", err);
                })
                .finally(() => {
                  // run main function
                  that.run();

                  that.$buefy.toast.open({
                    duration: 5000,
                    position: "is-bottom",
                    message: "Successfully deleted all the data in the video.",
                    type: "is-success"
                  });
                });
            }
          });
        })
        .catch(function(err) {
          console.error("Failed to open db: " + (err.stack || err));
        });
    },

    /**
     * Copy to Clipboard Functions
     */
    handleSuccess(e) {
      // console.log(e);
      this.$buefy.toast.open({
        message: "Copied Video URL: " + e.text,
        position: "is-bottom"
      });
    },
    handleError(e) {
      console.log(e);
    },

    /**___________________ Dexie Function ___________________________*/

    /**
     * Create IndexedDB `winners` Table
     */
    createWinnersTable: function() {
      this.db.winnerTableObj = new Dexie(this.db.winnerTable);

      this.db.winnerTableObj.version(1).stores({
        winnerdb: "++id,video_id,video_object,winner_object"
      });

      this.db.winnerTableObj.open().catch(function(err) {
        console.error("Failed to open db: " + (err.stack || err));
      });
    },

    /**
     * Fetch All Database names form indexedDB
     * -------------------------------------
     * Callback Parameters: All Database names
     * @returns: Promise
     */
    fetchDatabasesName: function() {
      // var that = this;
      return new Promise(function(resolve, reject) {
        Dexie.getDatabaseNames()
          .then(function(databases) {
            resolve(databases);
          })
          .catch(Dexie.BulkError, function(e) {
            reject(Error(e));
          });
      });
    },

    /**
     * Open IndexedDB Table `video_id`
     * @param {string} tableName
     */
    openVideoTable: function(tableName) {
      return new Promise(function(resolve, reject) {
        var db = new Dexie(tableName);
        db.version(1).stores({
          comments: "++id,uid,disp,purl,curl,comments,replies",
          info:
            "id,video_object,next_page,active_comments,status,unique_users,unique_ids"
        });
        db.open()
          .then(function(database) {
            resolve(database);
          })
          .catch(Dexie.BulkError, function(e) {
            reject(Error("Failed to open db: " + e));
          });
      });
    }
  },
  mounted: function() {
    this.createWinnersTable();
    this.init();
    this.$Progress.finish()
  }
};
</script>