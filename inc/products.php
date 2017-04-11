<?php 
include_once ('inc/connect.php');

class Product{

  public function show_product(){
    $db=new Database();
    $db->dbConnect();
    $link=$db->getConn();
    $query=  mysql_query("SELECT * FROM product") or die(mysql_error());
    $num=  mysql_num_rows($query);
     if($num>0){
      $i=0;
        //print_r(mysql_result($query,0));

      while($i<$num)
      {
            $prod_id=mysql_result($query,$i,"Prod_ID");
            $brand_id=mysql_result($query,$i,"Brand_ID");
            $cart_id=mysql_result($query,$i,"Cart_ID");
            $color=mysql_result($query,$i,"Color");
            $name=mysql_result($query,$i,"pname");
            $price=mysql_result($query,$i,"price");
            $image=mysql_result($query, $i,"Image");
            $description=mysql_result($query,$i,"Descri");
            $discount=mysql_result($query,$i,"Discount");
            $i=$i+1;
            $image="products/".$image;
           echo "
              <div class=\"col-md-3\">
                  <div class=\"card cust-size\">
                    <img class=\"img_size\" src=\"".$image."\" alt=\"Norway\">
                    <div class=\"text-center\">
                      <h1>".$name."</h1>
                      <p>".$color."<br>".$price."<br>".$description."</p>
                    </div>
                  <button  class=\"btn btn-primary waves-effect waves-light\" onclick=\"\">View More</button>
                  </div>
                </div>

           ";

      }
    }
  }

  public function best_price(){
    $db=new Database();
    $db->dbConnect();
    $query=mysql_query("SELECT * FROM `product` WHERE `Price`<=50") or die(mysql_error());
    $num=mysql_num_rows($query);
     if($num>0){
      $i=0;
        //print_r(mysql_result($query,0));

      while($i<$num)
      {
            $prod_id=mysql_result($query,$i,"Prod_ID");
            $brand_id=mysql_result($query,$i,"Brand_ID");
            $cart_id=mysql_result($query,$i,"Cart_ID");
            $color=mysql_result($query,$i,"Color");
            $name=mysql_result($query,$i,"pname");
            $price=mysql_result($query,$i,"price");
            $image=mysql_result($query, $i,"Image");
            $description=mysql_result($query,$i,"Descri");
            $discount=mysql_result($query,$i,"Discount");
            $i=$i+1;
            $image="products/".$image;
            
            echo"

                <div class=\"col-md-3\">
                  <div class=\"card cust-size\">
                    <img class=\"img_size\" src=\"".$image."\" alt=\"Norway\">
                    <div class=\"text-center\">
                      <h1>".$name."</h1>
                      <p>".$color."<br>".$price."<br>".$description."</p>
                    </div>
                  <button  class=\"btn btn-primary waves-effect waves-light\" onclick=\"\">View More</button>
                  </div>
                </div>
            ";

      } //While closed
  }  //If closed
} //best_price() closed

}//class Product closed
?>