class Post extends Component {
  // This determines whether a rendered post should get updated
  // Look at the states here, what could be changing as time goes by?
  // Only 2 properties: "liked" and "likeCount", if the person seeing
  // this post ever presses the "like" button
  // This assumes that, unlike Twitter, updates do not come from other
  // instances of the application in real time.
  shouldComponentUpdate(nextProps, nextState) {
    const { liked, likeCount } = nextProps;
    const { liked: oldLiked, likeCount: oldLikeCount } = this.props;

    // If "liked" or "likeCount" is different, then update
    return liked !== oldLiked || likeCount !== oldLikeCount;
  }

  render() {
    return (
      <View>
        {/* ...render other properties */}
        <TouchableOpacity
          onPress={() => this.props.onPressLike(this.props.postId)}
        >
          <Icon name="heart" color={this.props.liked ? "gray" : "red"} />
        </TouchableOpacity>
      </View>
    );
  }
}
