class UseractionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def new
    @useraction = Useraction.new
  end

  def create
    @useraction = Useraction.new(user_id: current_user.first_name, level: params[:level], action_category: params[:category], action_details: params[:details])
    respond_to do |format|
      @useraction.save
      format.html { redirect_to root_url }
      format.json {render :show, status: :created, location: @useraction }
    end
  end

  def destroy
  end

  def history 
    @history = Useraction.where('user_id = ? AND level = ? AND action_category = ?', current_user.first_name, 'level3', 'solution').order('id DESC').limit(5)
    respond_to do |format|
      #format.html { redirect_to root_url }
      format.json {render json: @history, status: :ok }
    end
  end
  
end
