respond_to :html, :xml, :json
...

def create
  @comment = Comment.new( params[:comment] )

  if @comment.save
    respond_with do |format|
      format.html do
        if request.xhr?
          render :partial => "comments/show", :locals => { :comment => @comment }, :layout => false, :status => :created
        else
          redirect_to @comment
        end
      end
    end
  else
    respond_with do |format|
      format.html do
        if request.xhr?
          render :json => @comment.errors, :status => :unprocessable_entity
        else
          render :action => :new, :status => :unprocessable_entity
        end
      end
    end
  end
end