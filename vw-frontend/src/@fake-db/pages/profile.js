import mock from "../mock";
const data = {
  profileData: {
    header: {
      avatar: require("@src/assets/images/portrait/small/avatar-blank.png")
        .default,
      username: "Kitty Allanson",
      designation: "UI/UX Designer",
      coverImg: require("@src/assets/images/profile/post-media/2.jpg").default,
    },
    userAbout: {
      about:
        "Tart I love sugar plum I love oat cake. Sweet ⭐️ roll caramels I love jujubes. Topping cake wafer.",
      joined: "November 15, 2015",
      lives: "New York, USA",
      email: "bucketful@fiendhead.org",
      website: "www.pixinvent.com",
    },
    suggestedPages: [
      {
        avatar: require("@src/assets/images/avatars/avatar-blank.png").default,
        username: "Peter Reed",
        subtitle: "Company",
        favorite: false,
      },
      {
        avatar: require("@src/assets/images/avatars/avatar-blank.png").default,
        username: "Harriett Adkins",
        subtitle: "Company",
        favorite: false,
      },
      {
        avatar: "",
        username: "Juan Weaver",
        subtitle: "Company",
        favorite: false,
      },
      {
        avatar: require("@src/assets/images/avatars/avatar-blank.png").default,
        username: "Claudia Chandler",
        subtitle: "Company",
        favorite: false,
      },
      {
        avatar: require("@src/assets/images/avatars/avatar-blank.png").default,
        username: "Earl Briggs",
        subtitle: "Company",
        favorite: true,
      },
      {
        avatar: require("@src/assets/images/avatars/avatar-blank.png").default,
        username: "Jonathan Lyons",
        subtitle: "Beauty Store",
        favorite: false,
      },
    ],
    twitterFeeds: [
      {
        imgUrl: require("@src/assets/images/avatars/avatar-blank.png").default,
        title: "Gertrude Stevens",
        id: "tiana59 ",
        tags: "#design #fasion",
        desc: "I love cookie chupa chups sweet tart apple pie ⭐️ chocolate bar.",
        favorite: false,
      },
      {
        imgUrl: require("@src/assets/images/avatars/avatar-blank.png").default,
        title: "Lura Jones",
        id: "tiana59 ",
        tags: "#vuejs #code #coffeez",
        desc: "Halvah I love powder jelly I love cheesecake cotton candy. 😍",
        favorite: true,
      },
      {
        imgUrl: require("@src/assets/images/avatars/avatar-blank.png").default,
        title: "Norman Gross",
        id: "tiana59 ",
        tags: "#sketch #uiux #figma",
        desc: "Candy jelly beans powder brownie biscuit. Jelly marzipan oat cake cake.",
        favorite: false,
      },
    ],
    post: [
      {
        avatar: require("@src/assets/images/portrait/small/avatar-blank.png")
          .default,
        username: "Leeanna Alvord",
        postTime: "12 Dec 2018 at 1:16 AM",
        postText:
          "Wonderful Machine· A well-written bio allows viewers to get to know a photographer beyond the work. This can make the difference when presenting to clients who are looking for the perfect fit.",
        postImg: require("@src/assets/images/profile/post-media/2.jpg").default,
        likes: "1.25k",
        youLiked: true,
        comments: "1.25k",
        share: "1.25k",
        likedUsers: [
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "Trine Lynes",
          },
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "Lilian Nenes",
          },
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "Alberto Glotzbach",
          },
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "George Nordic",
          },
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "Vinnie Mostowy",
          },
        ],
        likedCount: 140,
        detailedComments: [
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "Kitty Allanson",
            comment:
              "Easy & smart fuzzy search🕵🏻 functionality which enables users to search quickly.",
            commentsLikes: 34,
            youLiked: false,
          },
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "Jackey Potter",
            comment:
              "Unlimited color🖌 options allows you to set your application color as per your branding 🤪.",
            commentsLikes: 61,
            youLiked: true,
          },
        ],
      },
      {
        avatar: require("@src/assets/images/portrait/small/avatar-blank.png")
          .default,
        username: "Rosa Walters",
        postTime: "11 Dec 2019 at 1:16 AM",
        postText:
          "Wonderful Machine· A well-written bio allows viewers to get to know a photographer beyond the work. This can make the difference when presenting to clients who are looking for the perfect fit.",
        postImg: require("@src/assets/images/profile/post-media/2.jpg").default,
        likes: "1.25k",
        youLiked: true,
        comments: "1.25k",
        share: "1.25k",
        likedUsers: [
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "Kori Scargle",
          },
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "Florinda Mollison",
          },
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "Beltran Endley",
          },
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "Kara Gerred",
          },
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "Sophey Bru",
          },
        ],
        likedCount: 271,
        detailedComments: [
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "Kitty Allanson",
            comment:
              "Easy & smart fuzzy search🕵🏻 functionality which enables users to search quickly.",
            commentsLikes: 34,
            youLiked: false,
          },
        ],
      },
      {
        avatar: require("@src/assets/images/portrait/small/avatar-blank.png")
          .default,
        username: "Charles Watson",
        postTime: "12 Dec 2019 at 1:16 AM",
        postText:
          "Wonderful Machine· A well-written bio allows viewers to get to know a photographer beyond the work. This can make the difference when presenting to clients who are looking for the perfect fit.",
        postVid: "https://www.youtube.com/embed/6stlCkUDG_s",
        likes: "1.25k",
        youLiked: true,
        comments: "1.25k",
        share: "1.25k",
        likedUsers: [
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "Dehlia Bolderson",
          },
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "De Lamy",
          },
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "Vallie Kingsley",
          },
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "Nadia Armell",
          },
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "Romonda Aseef",
          },
        ],
        likedCount: 264,
        detailedComments: [
          {
            avatar:
              require("@src/assets/images/portrait/small/avatar-blank.png")
                .default,
            username: "Kitty Allanson",
            comment:
              "Easy & smart fuzzy search🕵🏻 functionality which enables users to search quickly.",
            commentsLikes: 34,
            youLiked: false,
          },
        ],
      },
    ],
    latestPhotos: [
      {
        img: require("@src/assets/images/profile/post-media/2.jpg").default,
      },
      {
        img: require("@src/assets/images/profile/post-media/2.jpg").default,
      },
      {
        img: require("@src/assets/images/profile/post-media/2.jpg").default,
      },
      {
        img: require("@src/assets/images/profile/post-media/2.jpg").default,
      },
      {
        img: require("@src/assets/images/profile/post-media/2.jpg").default,
      },
      {
        img: require("@src/assets/images/profile/post-media/2.jpg").default,
      },
      {
        img: require("@src/assets/images/profile/post-media/2.jpg").default,
      },
      {
        img: require("@src/assets/images/profile/post-media/2.jpg").default,
      },
      {
        img: require("@src/assets/images/profile/post-media/2.jpg").default,
      },
    ],
    suggestions: [
      {
        avatar: require("@src/assets/images/portrait/small/avatar-blank.png")
          .default,
        name: "Peter Reed",
        mutualFriend: "6 Mutual Friends",
      },
      {
        avatar: require("@src/assets/images/portrait/small/avatar-blank.png")
          .default,
        name: "Harriett Adkins",
        mutualFriend: "3 Mutual Friends",
      },
      {
        avatar: require("@src/assets/images/portrait/small/avatar-blank.png")
          .default,
        name: "Juan Weaver",
        mutualFriend: "1 Mutual Friends",
      },
      {
        avatar: require("@src/assets/images/portrait/small/avatar-blank.png")
          .default,
        name: "Claudia Chandler",
        mutualFriend: "16 Mutual Friends",
      },
      {
        avatar: require("@src/assets/images/portrait/small/avatar-blank.png")
          .default,
        name: "Earl Briggs",
        mutualFriend: "4 Mutual Friends",
      },
      {
        avatar: require("@src/assets/images/portrait/small/avatar-blank.png")
          .default,
        name: "Jonathan Lyons",
        mutualFriend: "25 Mutual Friends",
      },
    ],
    polls: [
      {
        name: "RDJ",
        result: "82%",
        votedUser: [
          {
            img: require("@src/assets/images/portrait/small/avatar-blank.png")
              .default,
            username: "Tonia Seabold",
          },
          {
            img: require("@src/assets/images/portrait/small/avatar-blank.png")
              .default,
            username: "Carissa Dolle",
          },
          {
            img: require("@src/assets/images/portrait/small/avatar-blank.png")
              .default,
            username: "Kelle Herrick",
          },
          {
            img: require("@src/assets/images/portrait/small/avatar-blank.png")
              .default,
            username: "Len Bregantini",
          },
          {
            img: require("@src/assets/images/portrait/small/avatar-blank.png")
              .default,
            username: "John Doe",
          },
        ],
      },
      {
        name: "Chris Hemsworth",
        result: "67%",
        votedUser: [
          {
            img: require("@src/assets/images/portrait/small/avatar-blank.png")
              .default,
            username: "Diana Prince",
          },
          {
            img: require("@src/assets/images/portrait/small/avatar-blank.png")
              .default,
            username: "Lois Lane",
          },
          {
            img: require("@src/assets/images/portrait/small/avatar-blank.png")
              .default,
            username: "Bruce Wayne",
          },
        ],
      },
    ],
  },
};

mock.onGet("/profile/data").reply(() => [200, data.profileData]);
