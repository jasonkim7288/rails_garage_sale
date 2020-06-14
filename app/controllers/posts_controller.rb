class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]
  before_action :change_date_format, only: [:create, :update]
  before_action :authenticate_user!, only: [:myposts, :new, :edit, :update, :destroy]
  before_action :set_origin, only: [:show, :new, :edit, :create, :update, :destroy]

  # GET /posts
  # GET /posts.json
  def index
    @posts = Post.where("close_date > ?", DateTime.current - 7.days).with_rich_text_body.order("updated_at DESC")
    @json_markers = @posts.inject([]) {|result, post| 
                                        result.push({id: post.id, latitude: post.latitude, longitude: post.longitude, address: post.address});
                                        result;
                                      }.to_json
    @address = get_query_value(:address)
    @east = get_query_value(:east)
    @north = get_query_value(:north)
    @south = get_query_value(:south)
    @west = get_query_value(:west)
    @lat = get_query_value(:lat)
    @lng = get_query_value(:lng)
    # Remember where is edit/delete started from. It could be started from index or myposts
    @origin = "index"
  end

  # GET /posts/1
  # GET /posts/1.json
  def show
    @post = Post.includes(:comments).find(params[:id])
    @comment = Comment.new
    @comments = @post.comments.includes(:user).order('updated_at DESC')
  end

  # GET /posts/new
  def new
    @post = Post.new
  end

  # GET /posts/1/edit
  def edit
  end

  # POST /posts
  # POST /posts.json
  def create
    @post = Post.new(post_params)

    if @post.save
      if @origin == "myposts"
        redirect_to posts_myposts_path, notice: 'Post was successfully created.'
      else
        redirect_to posts_url, notice: 'Post was successfully created.'
      end
    else
        render :new
    end
  end

  # PATCH/PUT /posts/1
  # PATCH/PUT /posts/1.json
  def update
    if @post.update(post_params)
      if @origin == "myposts"
        redirect_to posts_myposts_url, notice: 'Post was successfully updated.'
      else
        redirect_to posts_url, notice: 'Post was successfully updated.'
      end
    else
      render :edit
    end
  end

  # DELETE /posts/1
  # DELETE /posts/1.json
  def destroy
    @post.destroy
    if @origin == "myposts"
      redirect_to posts_myposts_url, notice: 'Post was successfully destroyed.'
    else
      redirect_to posts_url, notice: 'Post was successfully destroyed.'
    end
  end

  def myposts
    @posts = Post.where(user_id: current_user.id).with_rich_text_body.order("updated_at DESC")
    # Remember where is edit/delete started from. It could be started from index or myposts
    @origin = "myposts"
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def post_params
      params.require(:post).permit(:title, :address, :phone, :open_date, :close_date, :user_id, :body, :open_date, :close_date, :latitude, :longitude)
    end

    def set_origin
      @origin = params[:origin]
    end

    # input text format is "11/06/2020 9:00 AM"
    # the format in the Model is "Thu, 11 Jun 2020 09:00:00 AEST +10:00"
    def change_date_format
      post_params[:open_date] = post_params[:open_date].to_datetime
      post_params[:close_date] = post_params[:close_date].to_datetime
    end

    # get the query from url and return the value
    def get_query_value(param_symbol)
      params[param_symbol] && params[param_symbol].length < 2048 ? params[param_symbol] : ""
    end
end
