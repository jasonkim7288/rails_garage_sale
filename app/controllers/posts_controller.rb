class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]
  before_action :change_date_format, only: [:create, :update]

  # GET /posts
  # GET /posts.json
  def index
    @posts = Post.all.with_rich_text_body.order("created_at DESC")
    @json_markers = @posts.inject([]) {|result, post| 
                                        result.push({id: post.id, latitude: post.latitude, longitude: post.longitude});
                                        result;
                                      }.to_json
    puts('@json_markers:', @json_markers)
  end

  # GET /posts/1
  # GET /posts/1.json
  def show
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
        redirect_to posts_url, notice: 'Post was successfully created.'
    else
        render :new
    end
  end

  # PATCH/PUT /posts/1
  # PATCH/PUT /posts/1.json
  def update
    if @post.update(post_params)
      redirect_to posts_url, notice: 'Post was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /posts/1
  # DELETE /posts/1.json
  def destroy
    @post.destroy
    redirect_to posts_url, notice: 'Post was successfully destroyed.'
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

    # input text format is "11/06/2020 9:00 AM"
    # the format in the Model is "Thu, 11 Jun 2020 09:00:00 AEST +10:00"
    def change_date_format
      post_params[:open_date] = post_params[:open_date].to_datetime
      post_params[:close_date] = post_params[:close_date].to_datetime
    end
end
