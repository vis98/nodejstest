
const db = require('../db')
const fs=require('fs')
const productController= async (req, res, next) => {
  try{
    let pagesize = req.body.pagesize ? req.body.pagesize : 10;
    let currentpage = req.body.currentpage ? req.body.currentpage : 1
    let orderBy = req.body.orderBy ? req.body.orderBy : 'createdAt'
    let searchBy = req.body.searchBy ? req.body.searchBy : ''
    let searchFields = req.body.searchFields && req.body.searchFields.length ? req.body.searchFields : []
    let count=await db.query(`select count(1) as cnt
    from ProductV2 pro inner join
    CategoryV2 cat on pro.categoryId=cat.categoryId
    inner join CustomerUOM cuom on pro.uomId=cuom.uomId
                 `)

                 console.log("count is",count[0][0].cnt)

                 let totalCount=count[0][0].cnt
                 let totalPages=Math.ceil(totalCount/pagesize);

                 let base_query=`
      select productId,productName,productImagesName
     ,productImagesUrls
  
     ,brandName
     ,pro.description
  
     ,itemCode
     ,itemType
     ,currency
     ,currencyCode
     ,saleAmount
     ,broshureFileName
     ,broshureUrls
     ,vendors
     ,pro.status
     ,pro.createdBy
  
  
  
     ,pro.categoryId
  
  
     ,pro.uomId
  
  
     ,shipingMethodId
  
  
     ,shippingTermId
  
  
     ,paymentTermId
  
  
     ,categoryName
  
    from ProductV2 pro inner join
    CategoryV2 cat on pro.categoryId=cat.categoryId
    inner join CustomerUOM cuom on pro.uomId=cuom.uomId 
                 `
                 //limit ${pagesize} offset ${((currentpage-1)*pagesize)}

                 let result_query=base_query;
      console.log(
        "at 67",searchBy,searchFields
      )
      if(searchBy!='' && searchFields.length){
        let searchquery=''

        for(let i=0;i<searchFields.length;i++){
          searchquery=searchquery + `${searchFields[i]} like \'%${searchBy}%\' OR`
        }
        let trimmedStr = searchquery.replace(/\s*OR\s*/gi, '');
        
        result_query=result_query + ` where `+trimmedStr
        

      }

      result_query=result_query+ `  limit ${pagesize} offset ${((currentpage-1)*pagesize)}`
                 
   console.log("at",result_query)
    let product_result = await db.query(result_query)
    console.log("At 51",product_result)

    
    //   fs.writeFileSync(JSON.stringify(product_result))
      res.status(200).send({
        pagesize:pagesize,
        currentpage:currentpage,
        totalPages:totalPages,
        totalCount:totalCount,
        data:product_result[0].length ? product_result[0]:[]
      })
  }
  catch(err){
    console.log("Error",err)

    res.status(500).send({
      message:"eror occured"
    })
  }
}
module.exports = productController




