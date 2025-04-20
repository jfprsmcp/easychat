class KanbanStatePolicy < ApplicationPolicy
  def index?
    true
  end

  def update?
    @account_user.administrator?
  end

  def update_order_batch?
    @account_user.administrator?
  end

  def show?
    @account_user.administrator?
  end

  def create?
    @account_user.administrator?
  end

  def destroy?
    @account_user.administrator?
  end
end
