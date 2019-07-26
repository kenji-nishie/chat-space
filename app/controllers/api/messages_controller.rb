class Api::MessagesController < ApplicationController
  def index
    @messages = Message.where("(id > ?) AND (group_id = ?)", params[:id], params[:group_id])
    respond_to do |format|
      format.html
      format.json
    end
  end
end