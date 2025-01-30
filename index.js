import { tweetsData } from '/data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// LOCALSTORAGE SETUP
let savedTweets = JSON.parse(localStorage.getItem('savedTweets'))

if (savedTweets === null) {
    localStorage.setItem('savedTweets', JSON.stringify(tweetsData))
    savedTweets = JSON.parse(localStorage.getItem('savedTweets'))
}

console.log(savedTweets)

// FUNCTION TO UPDATE LOCALSTORAGE

function updateLocalStorage() {
    localStorage.setItem('savedTweets', JSON.stringify(savedTweets))
}


// EVENT LINSTER

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.dataset.comment) {
      handleCommentBtnClick(e.target.dataset.comment)

    }
    else if (e.target.dataset.trash) {
      handleDeleteBtnClick(e.target.dataset.trash)
    }
    else if (e.target.id === 'clear') {
        localStorage.clear()
        localStorage.setItem('savedTweets', JSON.stringify(tweetsData))
    }
})

// ADD SHOW STATE AND UUID FOR REPLIES

savedTweets.forEach(function(tweet){
    tweet.isShowing = false
    tweet.replies.forEach(function(reply) {
      reply.uuid = uuidv4()
    })
})

// FUNCTIONS
 
// FUNCTION TO HANDLE LIKES

function handleLikeClick(tweetId){ 
    const targetTweetObj = savedTweets.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

// FUNCTION TO HANDLE RETWEETS

function handleRetweetClick(tweetId){
    const targetTweetObj = savedTweets.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

// FUNCTION TO HANDLE REPLIES

function handleReplyClick(replyId){
    const targetTweetObj = savedTweets.filter(function(tweet) {
      return tweet.uuid === replyId
    })[0]

    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    targetTweetObj.isShowing = !targetTweetObj.isShowing
}

// FUNCTION TO HANDLE NEW TWEET

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        savedTweets.unshift({
            handle: `@Scrimba`,
            profilePic: `https://raw.githubusercontent.com/Skill1ssue/twimba/refs/heads/main/images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

// FUNCTION TO HANDLE NEW COMMENT

function handleCommentBtnClick(tweetId) {

    const targetTweetObj = savedTweets.filter(function(tweet) {
        return tweet.uuid === tweetId
    })[0]
  
    const comment = document.getElementById(`user-comment-${tweetId}`).value

    const reply = {
        handle: `@Scrimba`,
        profilePic: `https://raw.githubusercontent.com/Skill1ssue/twimba/refs/heads/main/images/scrimbalogo.png`,
        tweetText: `${comment}`,
        uuid: uuidv4(),
  }

    targetTweetObj.replies.unshift(reply)

    render()
}

// FUNCTION TO HANDLE DELETE COMMENT AND TWEET

function handleDeleteBtnClick(tweetId) {
    if (savedTweets.filter(function(tweet) {return tweet.uuid === tweetId}).length !== 0) {
        const index = savedTweets.findIndex(function(tweet) {return tweet.uuid === tweetId})
        savedTweets.splice(index, 1)
        render()
    } 
    else {
        const index = savedTweets.findIndex(function(tweet) {return tweet.replies.some(function(reply){return reply.uuid === tweetId})})
        const replyIndex = savedTweets[index].replies.findIndex(function(reply) {return reply.uuid === tweetId})
        savedTweets[index].replies.splice(replyIndex, 1)
        render()
    }
}

// FUNCTION TO GET ALL THE HTML

function getFeedHtml(){
    let feedHtml = ``
    
    savedTweets.forEach(function(tweet){

        const isHidden = tweet.isShowing ? "" : "hidden"
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        let isUser = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
              if (reply.handle !== '@Scrimba') {
                isUser = 'hidden'
              }
                repliesHtml+=`
                <div class="tweet-reply">
                <div class="tweet-inner">
                <span class='${isUser} tweet-option-btn'><i data-trash="${reply.uuid}" class="fa-solid fa-trash trash"></i></span>
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
                `
            })
        }
        
        if (tweet.handle !== '@Scrimba') {
                isUser = 'hidden'
              }
          
        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <span class='${isUser} tweet-option-btn'><i data-trash="${tweet.uuid}" class="fa-solid fa-trash trash"></i></span>
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots"
                            data-reply="${tweet.uuid}"
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"
                            data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                        </span>
                    </div>   
                    </div>            
                    </div>
                    <div class="${isHidden}" id="replies-${tweet.uuid}">
                    <div class="user-comment-container">
                        <div class="user-comment-form" id="user-comment-form-${tweet.uuid}">
                            <textarea id="user-comment-${tweet.uuid}"name="user-comment" class="user-comment" placeholder="leave a comment"></textarea>
                            <button data-comment=${tweet.uuid} class="user-comment-btn" onSubmit="preventDefault()">
                            <i class="fa-solid fa-paper-plane send-btn-icon"></i>
                            </button>
                        </div>
                    </div>
                ${repliesHtml}
            </div>   
        </div>
        `
   })
   return feedHtml 
}

function render(){
    updateLocalStorage()
    document.getElementById('feed').innerHTML = getFeedHtml()   
}

render()



