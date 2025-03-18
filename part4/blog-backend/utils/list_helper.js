const dummy = (blogs) => {
  if (blogs.length === 0){
    return 1
  }
  return 1
}
const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }
  return blogs.map(x => x.likes).reduce((a, item) => a + item, 0)
}
const favoriteBlog = (blogs) => {
  if (blogs.length === 0){
    return null
  }
  const blog = blogs.reduce((acumulativo, valor) => acumulativo.likes > valor.likes ? acumulativo : valor )

  return { title: blog.title, author: blog.author, likes: blog.likes }
}
const mostBlogs = (listblogs) => {
  let authorAndBlogs = []
  if (listblogs.length === 0) {
    return null
  }
  listblogs.forEach(blog => {
    if (authorAndBlogs.length === 0) {
      authorAndBlogs.push({
        author: blog.author,
        blogs: 1
      })
    } else if (authorAndBlogs.find(x => x.author === blog.author)) {
      authorAndBlogs = authorAndBlogs.map(item => {
        if (item.author !== blog.author) {
          return item
        } else {
          return { author: blog.author, blogs: item.blogs + 1 }
        }
      })
    } else {
      authorAndBlogs.push({
        author: blog.author,
        blogs: 1
      })
    }
  })
  return authorAndBlogs.reduce((acumulativo, valor) => acumulativo.blogs > valor.blogs ? acumulativo : valor)
}
const mostLiks = (listblogs) => {
  let authorAndBlogs = []
  if (listblogs.length === 0) {
    return null
  }
  listblogs.forEach(blog => {
    if (authorAndBlogs.length === 0) {
      authorAndBlogs.push({
        author: blog.author,
        likes: blog.likes
      })
    } else if (authorAndBlogs.find(x => x.author === blog.author)) {
      authorAndBlogs = authorAndBlogs.map(item => {
        if (item.author !== blog.author) {
          return item
        } else {
          return { author: blog.author, likes: item.likes + blog.likes }
        }
      })
    } else {
      authorAndBlogs.push({
        author: blog.author,
        likes: blog.likes
      })
    }
  })
  return authorAndBlogs.reduce((acumulativo, valor) => acumulativo.likes > valor.likes ? acumulativo : valor)
}
module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLiks }