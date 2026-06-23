import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [videos, setVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [file, setFile] = useState(null)

  useEffect(() => {
    loadVideos()
    loadComments()
  }, [])

  const loadVideos = async () => {
    const res = await axios.get('http://localhost:5000/api/videos')
    setVideos(res.data)
  }

  const loadComments = async () => {
    const res = await axios.get('http://localhost:5000/api/comments')
    setComments(res.data)
  }

  const uploadVideo = async () => {
    if (!file) {
      alert('Choose video first')
      return
    }

    const formData = new FormData()
    formData.append('video', file)

    await axios.post('http://localhost:5000/upload', formData)

    setFile(null)
    loadVideos()
  }

  const addComment = async () => {
    if (!comment.trim()) {
      alert('Write comment first')
      return
    }

    await axios.post('http://localhost:5000/api/comments', {
      videoName: selectedVideo ? selectedVideo.name : 'general',
      text: comment
    })

    setComment('')
    loadComments()
  }

  const videoComments = comments.filter((c) =>
    selectedVideo ? c.videoName === selectedVideo.name : c.videoName === 'general'
  )

  return (
    <div className="container">
      <h1>Simple Video Hosting</h1>

      <div className="upload-box">
        <h2>Upload video</h2>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={uploadVideo}>Upload</button>
      </div>

      <div className="content">
        <div className="video-list">
          <h2>Videos</h2>

          {videos.length === 0 && <p>No videos uploaded yet</p>}

          {videos.map((video, index) => (
            <button
              key={index}
              className="video-button"
              onClick={() => setSelectedVideo(video)}
            >
              {video.name}
            </button>
          ))}
        </div>

        <div className="player-box">
          <h2>Player</h2>

          {selectedVideo ? (
            <video controls src={selectedVideo.url}></video>
          ) : (
            <p>Select video from list</p>
          )}

          <h2>Comments</h2>

          <div className="comment-form">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write comment"
            />

            <button onClick={addComment}>Add comment</button>
          </div>

          <div className="comments">
            {videoComments.length === 0 && <p>No comments yet</p>}

            {videoComments.map((c, index) => (
              <p key={index} className="comment">
                {c.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App