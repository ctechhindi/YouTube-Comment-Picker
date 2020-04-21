<template>
  <div class="picker">
    <!-- Video Details -->
    <section
      class="hero is-danger is-bold"
      style="background-color: #FFE53B; background-image: linear-gradient(147deg, #FFE53B 0%, #FF2525 74%);"
    >
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column">
              <figure class="image animated fadeInLeft">
                <b-loading :is-full-page="false" :active.sync="videoFetchLoading"></b-loading>
                <img
                  :src="video.thumnail"
                  alt="Video Image"
                  style="min-width: 300px; height: 290px;"
                />
              </figure>
            </div>
            <div class="column is-9">
              <h1 class="title is-6 has-text-centered animated fadeInRight">
                <a class="has-text-white" :href="video.url" target="_new">{{ video.title }}</a>
              </h1>
              <nav class="level box">
                <div class="level-item has-text-centered">
                  <div class="animated fadeInUp">
                    <p class="heading">
                      <b-icon icon="comment-text-multiple-outline" custom-size="mdi-18px"></b-icon>&nbsp;Active Comments
                    </p>
                    <p class="title has-text-black">{{ comment.countComments }}</p>
                    <img
                      :src="comment.loadingImg"
                      v-show="comment.isloadingImg"
                      style="width: 40px;"
                      alt="loading"
                    />
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div class="animated fadeInUp">
                    <p class="heading">
                      <b-icon icon="account-group" custom-size="mdi-18px"></b-icon>&nbsp;Unique Users
                    </p>
                    <p class="title has-text-black">{{ comment.totalUniqueUser }}</p>
                    <img
                      :src="comment.loadingImg"
                      v-show="comment.uniqueUserLoading"
                      style="width: 40px;"
                      alt="loading"
                    />
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div class="animated fadeInUp">
                    <p class="heading">
                      <b-icon icon="comment-text-outline" custom-size="mdi-18px"></b-icon>&nbsp;Comments
                    </p>
                    <b-tooltip :label="video.commentsF" position="is-bottom">
                      <p class="title has-text-black">{{ video.comments }}</p>
                    </b-tooltip>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div class="animated fadeInUp">
                    <p class="heading">
                      <b-icon icon="eye-check-outline" custom-size="mdi-18px"></b-icon>&nbsp; View
                    </p>
                    <b-tooltip :label="video.viewsF" position="is-bottom">
                      <p class="title has-text-black">{{ video.views }}</p>
                    </b-tooltip>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div class="animated fadeInUp">
                    <p class="heading">
                      <b-icon icon="thumb-up-outline" custom-size="mdi-18px"></b-icon>&nbsp; Likes
                    </p>
                    <b-tooltip :label="video.likesF" position="is-bottom">
                      <p class="title has-text-black">{{ video.likes }}</p>
                    </b-tooltip>
                  </div>
                </div>
                <!-- <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">
                      <b-icon icon="thumb-down" custom-size="mdi-18px"></b-icon>&nbsp; Dislikes
                    </p>
                    <b-tooltip :label="video.dislikesF" position="is-bottom">
                      <p class="title has-text-black">{{ video.dislikes }}</p>
                    </b-tooltip>
                  </div>
                </div>-->
              </nav>
              <!-- If video table exists in the indexedDB -->
              <nav class="level animated zoomInUp">
                <div class="level-item" v-show="actionBtn.resume">
                  <button class="button" @click="resumeFetchVideoComment()">
                    <b-icon icon="play" type="is-info"></b-icon>
                    <span>Resume</span>
                  </button>
                </div>
                <div class="level-item" v-show="actionBtn.pause">
                  <button class="button is-warning is-medium" @click="pauseFetchVideoComment()">
                    <b-icon icon="pause"></b-icon>
                    <span>Pause</span>
                  </button>
                </div>
                <div
                  class="level-item"
                  v-show="actionBtn.restart"
                  @click="restartFetchVideoComment(video.id)"
                >
                  <button class="button">
                    <b-icon icon="restore" type="is-warning"></b-icon>
                    <span>Restart</span>
                  </button>
                </div>
                <div class="level-item" v-show="actionBtn.winner">
                  <button
                    ref="winnerBtn"
                    class="button is-medium is-dark is-rounded"
                    @click="generateVideoWinner()"
                  >
                    <b-icon icon="trophy" type="is-success"></b-icon>
                    <span>Choose Winner</span>
                  </button>
                </div>
                <div class="level-item" v-show="actionBtn.delete">
                  <button class="button is-white" @click="deleteVideoDB(video.id)">
                    <b-icon icon="trash-can-outline" type="is-danger"></b-icon>
                    <span>Delete</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
    <winners v-model="winnerData" v-show="winnerTemplate" :key="refreshWinnerTemplate"></winners>
  </div>
</template>

<script>
// https://cssgradient.io/gradient-backgrounds/
import Dexie from "dexie";
import axios from "axios";

var numeral = require("numeral");
numeral.register("locale", "fr", {
  delimiters: {
    thousands: ","
    // decimal: ','
  },
  abbreviations: {
    thousand: "K",
    million: "M",
    billion: "B",
    trillion: "T"
  },
  ordinal: function(number) {
    return number === 1 ? "er" : "ème";
  },
  currency: {
    symbol: "€"
  }
});
numeral.locale("fr");

import { Random } from "random-js";
const random = new Random();

import vImage from "@/assets/img/search.svg";
import cGit from "@/assets/img/loading-line-50px.gif";

import Winner from "@/components/Winner";

export default {
  name: "Picker",
  components: {
    winners: Winner
  },
  metaInfo: {
    title: "Comment Picker",
    titleTemplate: "%s - YouTube Comment Picker V3",
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  data() {
    return {
      // Video Data, same object in the resetData() function
      video: {
        id: "",
        title: "",
        url: "",
        thumnail: vImage,
        comments: 0,
        commentsF: "0", // Number Formate
        views: 0,
        viewsF: "0", // Number Formate
        likes: 0,
        likesF: "0", // Number Formate
        dislikes: 0,
        dislikesF: "0" // Number Formate
      },
      comment: {
        loadingImg: cGit, // Line Loading Gif Image
        isloadingImg: false, // Hide/Show Loading Gif Image
        pauseRequest: false, // Pause Fetch Comment Request
        // totalCommentsRequest: 0, // Count Comment Request
        nextPageToken: "", // Next Page Token
        countComments: 0, // Count Total Comment
        uniqueUserLoading: false, // Unique User Loading
        totalUniqueUser: 0, // Total Unique Users
        uniqueUserId: false // Total Unique Users Id
      },
      actionBtn: {
        resume: false,
        pause: false,
        restart: false,
        winner: false,
        delete: false
      },
      videoFetchLoading: false,
      // IndexedDB Data
      db: {
        winnerTable: "youtube-comment-picker-v3-winners",
        winnerTableObj: false,
        videoTableObj: false
      },
      // Winner Data
      winnerData: {},
      winnerTemplate: false,
      refreshWinnerTemplate: 0, // Reload Winner Template
      api: {
        baseURL: "https://yt.ctechhindi.in", // https://youtubeapis.000webhostapp.com,
        videoInfo: "/api/youtube-video-info-v2.php",
        videoComment: "/api/youtube-video-comments-v3.2.php"
      }
    };
  },
  methods: {
    /**
     * Init
     */
    init() {
      var that = this;

      // {@call}
      this.resetData();

      // YouTube Video ID
      this.video.id = this.$route.params.id;
      // YouTube Video URL
      this.video.url = "https://www.youtube.com/watch?v=" + this.video.id;

      // Unique Users, Count Comments Data
      that.comment.totalUniqueUser = 0;
      that.comment.uniqueUserId = false;
      that.comment.countComments = 0;

      // Check indexedDB database exists
      Dexie.exists(this.video.id)
        .then(function(is) {
          if (is) {
            // create indexedDB video table
            that.createVideoTable(that.video.id);

            that.videoFetchLoading = true;

            // fetch video information in the db table
            that.db.videoTableObj.info.get(1, function(videoData) {
              if (videoData != undefined) {
                // Integrate Video Information
                that.integrateVideoData(videoData.video_object);

                // Check Video Comment Loaded
                if (videoData.status === true) {
                  // Video Comments Loaded

                  // Unique Users, Count Comments Data
                  that.comment.totalUniqueUser = videoData.unique_users;
                  that.comment.uniqueUserId = videoData.unique_ids;
                  that.comment.countComments = videoData.active_comments;

                  // Hide and Show Action Button
                  that.actionButton({
                    pause: false,
                    resume: false,
                    restart: true,
                    winner: true,
                    delete: true
                  });
                } else {
                  // Fetch More Comments

                  // Hide and Show Action Button
                  that.actionButton({
                    pause: false,
                    resume: true,
                    restart: true,
                    winner: false,
                    delete: true
                  });
                }
              } else {
                // fetch video details
                that.getVideoInfo();
              }
            });
          } else {
            // create indexedDB video table
            that.createVideoTable(that.video.id);
            // fetch video details
            that.getVideoInfo();
          }
        })
        .catch(function(error) {
          console.error(
            "Oops, an error occurred when trying to check database existance",
            error
          );
        });
    },

    /**
     * Reset Old Data
     */
    resetData() {
      // Same object in vue js data function
      var video = {
        title: "",
        url: "",
        thumnail: vImage,
        comments: 0,
        commentsF: "0", // Number Formate
        uniqueUsers: 0,
        views: 0,
        viewsF: "0", // Number Formate
        likes: 0,
        likesF: "0", // Number Formate
        dislikes: 0,
        dislikesF: "0" // Number Formate
      };

      this.video = video;
    },

    /**
     * [Request]: Fetch Video Information
     */
    getVideoInfo: function() {
      var that = this;

      // Start: Full Page Loading
      var pageLoading = this.$buefy.loading.open();

      // Stop: Video Thumbnail Loading
      this.videoFetchLoading = false;

      axios
        .get(that.api.baseURL + "" + that.api.videoInfo, {
          params: {
            id: this.video.id
          }
        })
        .then(function(response) {
          if (response.data.status === true) {
            var data = response.data.data;

            // Integrate Video Information
            that.integrateVideoData(data);

            that.db.videoTableObj.info
              .add({
                id: 1,
                video_object: data,
                unique_users: 0,
                next_page: data.next_page_token,
                active_comments: 0
              })
              .catch(Dexie.BulkError, function(e) {
                console.error(e);
              });

            // Fetch Video Comment
            that.fetchVideoComment();
          } else {
            if (response.data.error === "video not found.") {
              that.$buefy.dialog.confirm({
                message: "This video does not exist on YouTube.",
                type: "is-danger",
                hasIcon: true,
                onConfirm: () => that.$router.push({ name: "Home" })
              });
            } else {
              that.$buefy.dialog.confirm({
                message:
                  "Your network connection seems to be disabled. please check and retry..",
                confirmText: "Retry",
                type: "is-warning",
                hasIcon: true,
                onConfirm: function() {
                  that.getVideoInfo();
                }
              });
            }
          }
          // Stop: Full Page Loading
          pageLoading.close();
        })
        .catch(function(error) {
          // Stop: Full Page Loading
          pageLoading.close();

          that.$buefy.dialog.confirm({
            message:
              "Your network connection seems to be disabled. please check and retry..",
            confirmText: "Retry",
            type: "is-warning",
            hasIcon: true,
            onConfirm: function() {
              that.getVideoInfo();
            }
          });
          console.error(error);
        });
    },

    /**
     * Integrate Video Information
     * @param {object} data
     */
    integrateVideoData: function(data) {
      this.video.id = data.id;
      this.video.title = data.tile;
      this.video.thumnail = data.thum;
      // numeral(data.comms).format('0a');
      this.video.comments = data.comms;
      this.video.views = numeral(data.view).format("0a");
      this.video.likes = numeral(data.like).format("0a");
      this.video.dislikes = numeral(data.dlike).format("0a");
      // 1,000 format
      this.video.commentsF = numeral(data.comms).format("0,0");
      this.video.viewsF = numeral(data.view).format("0,0");
      this.video.likesF = numeral(data.like).format("0,0");
      this.video.dislikesF = numeral(data.dlike).format("0,0");

      // Stop: Video Thumbnail Loading
      this.videoFetchLoading = false;
    },

    /**
     * Fetch Video Comment
     */
    fetchVideoComment() {
      var that = this;

      // Check fetch comment request is pause
      if (this.comment.pauseRequest === false) {
        // Loading Start
        this.comment.isloadingImg = true;

        // Hide and Show Action Button
        this.actionButton({
          pause: true,
          resume: false,
          delete: false,
          winner: false,
          restart: false
        });

        axios
          .get(that.api.baseURL + "" + that.api.videoComment, {
            params: {
              videoId: this.video.id,
              token: this.comment.nextPageToken
            }
          })
          .then(function(resp) {
            var result = resp.data;

            if (result.status === true) {
              // next page token
              that.comment.nextPageToken = result.next_page_token;

              // all request count total comments
              that.comment.countComments += result.total_comments;

              /**
               * Add all comments in indexedDB
               * ------------------------------
               * @Table Name: `comments`
               */
              that.db.videoTableObj.comments
                .bulkAdd(result.data)
                .catch(Dexie.BulkError, function(e) {
                  console.error(e);
                });

              /**
               * Update video information in indexedDB
               * ----------------------------------------
               * IndexedDB Table: info
               * @param: status: false
               * @param: next_page: next_page_token
               * @param: active_comments: total active comments
               */
              that.db.videoTableObj.info
                .update(1, {
                  status: false,
                  next_page: result.next_page_token,
                  active_comments: that.comment.countComments
                })
                .then(function(updated) {
                  if (updated) {
                    // console.log ("Update Video Table Data.");
                  } else {
                    console.error("Nothing was updated Video Data.");
                  }
                });

              if (result.isNextPage == true || result.next_page_token != "") {
                // {@call}
                return that.fetchVideoComment();
              } else {
                // Gif Loading Stop
                that.comment.isloadingImg = false;

                // Gif Loading Start
                that.comment.uniqueUserLoading = true;

                /**
                 * Update video information in indexedDB
                 * --------------------------------------
                 * IndexedDB Table: info
                 * @param: status: true
                 */
                that.db.videoTableObj.info
                  .update(1, { status: true })
                  .then(function(updated) {
                    if (updated) {
                      // console.log("All comments have been loaded.");
                    } else {
                      console.error("Nothing was updated Video Info");
                    }
                  });

                // fetch array() unique users uid's
                that.fetchUniqueUsers().then(
                  function(uniqueUsersIds) {
                    /**
                     * Update video information in indexedDB
                     * --------------------------------------
                     * IndexedDB Table: info
                     * @param: unique_users: total unique users
                     * @param: unique_ids: uniqueUsersIds
                     */
                    that.db.videoTableObj.info
                      .update(1, {
                        unique_users: uniqueUsersIds.length,
                        unique_ids: uniqueUsersIds
                      })
                      .then(function(updated) {
                        if (updated) {
                          // console.log("Video unique users have been loaded.");
                        } else {
                          console.error("Nothing was updated Video Info");
                        }
                      });

                    // total unique users
                    that.comment.totalUniqueUser = uniqueUsersIds.length;

                    // all user unique ids
                    that.comment.uniqueUserId = uniqueUsersIds;
                  },
                  function(error) {
                    console.error("Failed!", error);
                  }
                );

                // Hide and Show Action Button
                that.actionButton({
                  pause: false,
                  resume: false,
                  delete: true,
                  winner: true,
                  restart: true
                });

                // Gif Loading Stop
                that.comment.uniqueUserLoading = false;
              }
            } else {
              that.$buefy.dialog.confirm({
                message:
                  "Your network connection seems to be disabled. please check and retry..",
                confirmText: "Retry",
                type: "is-warning",
                hasIcon: true,
                onConfirm: function() {
                  that.fetchVideoComment();
                }
              });
            }
          })
          .catch(function(error) {
            console.log("fetchVideoComment -> error", error);
            that.$buefy.dialog.confirm({
              message:
                "Your network connection seems to be disabled. please check and retry..",
              confirmText: "Retry",
              type: "is-warning",
              hasIcon: true,
              onConfirm: function() {
                that.fetchVideoComment();
              }
            });
          });
      }
    },

    /**
     * Resume Fetch Video Comment
     */
    resumeFetchVideoComment() {
      var that = this;

      // Video comment request play
      this.comment.pauseRequest = false;

      this.db.videoTableObj.info.get(1, function(videoinfo) {
        if (videoinfo != undefined) {
          // Request Next Page Token
          that.comment.nextPageToken = videoinfo.next_page;
          // Total Fetched Comments
          that.comment.countComments = videoinfo.active_comments;

          // Integrate Video Information
          that.integrateVideoData(videoinfo.video_object);

          // Fetch video comment
          that.fetchVideoComment();
        } else {
          // Fetch video information
          that.getVideoInfo();
        }
      });
    },

    /**
     * Pause Fetch Video Comment
     */
    pauseFetchVideoComment() {
      // Video comment request play
      this.comment.pauseRequest = true;

      // Hide Loading Gif File
      this.comment.isloadingImg = false;

      // Hide and Show Action Button
      this.actionButton({
        pause: false,
        resume: true,
        delete: true,
        winner: false,
        restart: true
      });
    },

    /**
     * Delete YouTube Video Table in the IndexedDB
     * @param {string} id
     */
    deleteVideoDB: function(id) {
      var that = this;

      this.$buefy.dialog.confirm({
        title: "Delete Action",
        message:
          "Are you sure you want to <b>delete</b> video all data? This action cannot be undone.",
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        onConfirm: function() {
          // Start: Full Page Loading
          var loadingComponent = that.$buefy.loading.open();

          // delete winners for video id
          that.db.winnerTableObj.winnerdb
            .where("video_id")
            .equalsIgnoreCase(id)
            .toArray(function(winners) {
              if (winners.length != 0) {
                winners.forEach(function(item) {
                  if (item["id"] != undefined)
                    that.db.winnerTableObj.winnerdb.delete(item["id"]);
                });
              }
            });

          // Delete video table
          Dexie.delete(id)
            .then(function() {
              // Stop: Full Page Loading
              loadingComponent.close();
              console.warn("Database successfully deleted: " + id);
            })
            .catch(function(err) {
              console.error("Could not delete database", err);
            })
            .finally(function() {
              that.$buefy.snackbar.open({
                message: "All data related to the video has been deleted.",
                type: "is-success",
                position: "is-bottom"
              });

              // Go to Home Page
              that.$router.push({ name: "Home" });
            });
        }
      });
    },

    /**
     * Action on Action Button
     * @param {object} data
     * -------------------------------------
     * this.actionButton({pause: true});
     */
    actionButton(data) {
      if (typeof data === "object") {
        for (let index = 0; index < Object.keys(data).length; index++) {
          const key = Object.keys(data)[index];
          const value = data[key];

          if (this.actionBtn[key] !== undefined) {
            this.actionBtn[key] = value;
          }
        }
      }
    },

    /**
     * Restart Fetch Video Comment
     * @param {string} id
     */
    restartFetchVideoComment(id) {
      var that = this;

      this.$buefy.dialog.confirm({
        title: "Restart Action",
        message:
          "Are you sure you want to restart video comments? This action <b>removes</b> all old data. This action cannot be undone.",
        confirmText: "Restart",
        type: "is-danger",
        hasIcon: true,
        onConfirm: function() {
          // Start: Full Page Loading
          var loadingComponent = that.$buefy.loading.open();

          // delete winners for video id
          that.db.winnerTableObj.winnerdb
            .where("video_id")
            .equalsIgnoreCase(id)
            .toArray(function(winners) {
              if (winners.length != 0) {
                winners.forEach(function(item) {
                  if (item["id"] != undefined)
                    that.db.winnerTableObj.winnerdb.delete(item["id"]);
                });
              }
            });

          // delete table
          Dexie.delete(id)
            .then(function() {
              // Stop: Full Page Loading
              loadingComponent.close();
              console.warn("Database successfully deleted: " + id);
            })
            .catch(function(err) {
              console.error("Could not delete database", err);
            })
            .finally(function() {
              // run function call
              that.init();
            });
        }
      });
    },

    /**
     * Generate Video Comment Winner
     */
    generateVideoWinner() {
      var that = this;

      // Add Loading CSS Class in this button
      this.$refs.winnerBtn.classList.add("is-loading");

      // Video Unique User
      if (
        this.comment.uniqueUserId != false &&
        this.comment.uniqueUserId != 0
      ) {
        var randomNum = random.integer(0, this.comment.uniqueUserId.length - 1);
        var winnerKey = this.comment.uniqueUserId[randomNum];

        // Winner Information
        var winnerData = {};
        // Winner Comments
        var winnerComments = [];

        if (winnerKey && winnerKey != undefined) {
          that.db.videoTableObj.comments
            .where("uid")
            .equalsIgnoreCase(winnerKey)
            .toArray()
            .then(
              function(data) {
                data.forEach(function(win) {
                  if (win != undefined) {
                    winnerComments.push(win.comments);

                    winnerData["disp"] = win.disp;
                    winnerData["purl"] = win.purl;
                    winnerData["curl"] = win.curl;
                    winnerData["uid"] = win.uid;
                    winnerData["comments"] = winnerComments;

                    // Event tracking in Google Analytics
                    that.$ga.event("Generate Winner", that.video.url, win.curl);
                  } else {
                    that.$buefy.toast.open({
                      message: "Winner Data Not Found!",
                      position: "is-bottom",
                      type: "is-danger"
                    });
                  }
                });

                // Total Comments
                var tcomm = Object.keys(winnerData.comments).length;
                // Video Inforamtion
                var videoObject = {
                  comms: that.video.comments,
                  active_comms: that.comment.countComments,
                  unique_users: that.comment.totalUniqueUser,
                  url: that.video.url,
                  image: that.video.thumnail,
                  title: that.video.title,
                  view: that.video.viewsF,
                  likes: that.video.likesF,
                  dislikes: that.video.dislikesF
                };
                // Winner
                var winnerObject = {
                  winner_id: winnerKey, // winner channel id
                  winner_curl: winnerData.curl, // winner channel name
                  winner_name: winnerData.disp, // winner display name
                  winner_purl: winnerData.purl, // winner profile url
                  tcomm: tcomm, // total comments
                  comments: winnerData.comments // comments in array
                };

                // add winner information in indexedDB
                that.db.winnerTableObj.winnerdb
                  .add({
                    video_id: that.video.id,
                    video_object: videoObject,
                    winner_object: winnerObject
                  })
                  .catch(Dexie.BulkError, function(e) {
                    console.error(e);
                  });

                // {@call}
                that.showWinnerTemplate(winnerObject, videoObject);
              },
              reason => {
                console.error("onRejected function called: ", reason);
                that.generateVideoWinner();
              }
            );
        } else {
          this.$buefy.toast.open({
            message: "Video Comments Not Found [2].",
            position: "is-bottom",
            type: "is-danger"
          });
        }
      } else {
        this.$buefy.toast.open({
          message: "Video Comments Not Found.",
          position: "is-bottom",
          type: "is-danger"
        });
      }

      // Remove Loading CSS Class in this button
      this.$refs.winnerBtn.classList.remove("is-loading");
    },

    /**
     * Show Winner Template
     * @param {object} data
     * @param {object} video
     */
    showWinnerTemplate: function(data, video) {
      if (data !== undefined && data !== null) {
        var winnerData = {
          userId: data.winner_id,
          channelUrl: data.winner_curl,
          name: data.winner_name,
          photo: data.winner_purl,
          totalComment: data.tcomm,
          comments: data.comments,
          // Video Information
          videoTitle: video.title,
          videoThumbnail: video.image,
          videoUrl: video.url
        };

        this.winnerData = winnerData;

        // Reload Winner Template
        this.refreshWinnerTemplate = this.refreshWinnerTemplate + 1;

        // Show Winner Template
        this.winnerTemplate = true;

        // Page Scroll to Bottom
        setTimeout(() => {
          window.scrollBy(0, window.screen.height);
        }, 100);
      }
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
     * Create IndexedDB `video_id` Table
     * @param {string} tableName
     */
    createVideoTable: function(tableName) {
      this.db.videoTableObj = new Dexie(tableName);

      this.db.videoTableObj.version(1).stores({
        comments: "++id,uid,disp,purl,curl,comments,replies",
        info:
          "id,video_object,next_page,active_comments,status,unique_users,unique_ids"
      });

      this.db.videoTableObj.open().catch(function(err) {
        console.error("Failed to open db: " + (err.stack || err));
      });
    },

    /**
     * Fetch Unique Users in the Video Comment
     * -------------------------------------
     * Callback Parameters: Array of Unique Users keys
     * @returns: Promise
     */
    fetchUniqueUsers: function() {
      var that = this;
      return new Promise(function(resolve, reject) {
        that.db.videoTableObj.comments
          .orderBy("uid")
          .uniqueKeys()
          .then(function(data) {
            resolve(data);
          })
          .catch(Dexie.BulkError, function(e) {
            reject(Error(e));
          });
      });
    }
  },
  created() {
    this.createWinnersTable();
    this.init();
  },
  mounted() {
    this.$Progress.finish();
  }
};
</script>