require "test_helper"

class UseractionControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get useraction_new_url
    assert_response :success
  end

  test "should get create" do
    get useraction_create_url
    assert_response :success
  end

  test "should get destroy" do
    get useraction_destroy_url
    assert_response :success
  end
end
