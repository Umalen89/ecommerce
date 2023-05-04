CREATE TABLE "users" (
	"id" serial NOT NULL,
	"username" varchar(40) NOT NULL UNIQUE,
	"email" varchar(60) NOT NULL UNIQUE,
	"last_loggedin" DATE,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "passwords" (
	"userid" integer NOT NULL,
	"password" varchar(150) NOT NULL,
	CONSTRAINT "passwords_pk" PRIMARY KEY ("userid")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "user_personal_info" (
	"userid" integer NOT NULL,
	"first_name" varchar(25) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"date_of_birth" DATE NOT NULL,
	"phone_number" varchar(30) NOT NULL,
	CONSTRAINT "user_personal_info_pk" PRIMARY KEY ("userid")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "carts" (
	"userid" integer NOT NULL,
	"total_cart_price" DECIMAL NOT NULL,
	CONSTRAINT "carts_pk" PRIMARY KEY ("userid")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "products" (
	"id" serial NOT NULL,
	"name" varchar(120) NOT NULL UNIQUE,
	"description" varchar(255),
	"image" varchar(140),
	"price" DECIMAL NOT NULL,
	"instore" integer NOT NULL,
	"categoryid" integer NOT NULL,
	CONSTRAINT "products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "categories" (
	"id" serial NOT NULL,
	"category_name" varchar(20) NOT NULL UNIQUE,
	CONSTRAINT "category_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "carts_products" (
	"cart_userid" integer NOT NULL,
	"productid" integer NOT NULL,
	"qty" integer NOT NULL,
	"total_pp" DECIMAL NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE "orders" (
	"id" serial NOT NULL,
	"userid" integer NOT NULL,
	"order_date" date NOT NULL,
	"total_price" DECIMAL(15) NOT NULL,
	"status" varchar(15) NOT NULL,
	"modified" date NOT NULL,
	"del_postcode" varchar(15) NOT NULL,
	"del_street" varchar(15) NOT NULL,
	"del_city" varchar(15) NOT NULL,
	"del_county" varchar(15) NOT NULL
	CONSTRAINT "orders_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "orders_products" (
	"orderid" integer NOT NULL,
	"productid" integer NOT NULL,
	"product_name" varchar(80) NOT NULL,
	"qty" integer NOT NULL,
	"total_pp" DECIMAL NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE "addresses" (
	"id" serial NOT NULL,
	"userid" integer NOT NULL,
	"postcode" varchar(15) NOT NULL,
	"street" varchar(150) NOT NULL,
	"city" varchar(25) NOT NULL,
	"county" varchar(40) NOT NULL,
	CONSTRAINT "addresses_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");




ALTER TABLE "passwords" ADD CONSTRAINT "passwords_fk0" FOREIGN KEY ("userid") REFERENCES "users"("id");

ALTER TABLE "user_personal_info" ADD CONSTRAINT "user_personal_info_fk0" FOREIGN KEY ("userid") REFERENCES "users"("id");

ALTER TABLE "carts" ADD CONSTRAINT "carts_fk0" FOREIGN KEY ("userid") REFERENCES "users"("id");

ALTER TABLE "products" ADD CONSTRAINT "products_fk0" FOREIGN KEY ("categoryid") REFERENCES "category"("id");


ALTER TABLE "carts_products" ADD CONSTRAINT "carts_products_fk0" FOREIGN KEY ("cart_userid") REFERENCES "carts"("userid");
ALTER TABLE "carts_products" ADD CONSTRAINT "carts_products_fk1" FOREIGN KEY ("productid") REFERENCES "products"("id");

ALTER TABLE "orders" ADD CONSTRAINT "orders_fk0" FOREIGN KEY ("userid") REFERENCES "users"("id");

ALTER TABLE "orders_products" ADD CONSTRAINT "orders_products_fk0" FOREIGN KEY ("orderid") REFERENCES "orders"("id");

ALTER TABLE "addresses" ADD CONSTRAINT "addresses_fk0" FOREIGN KEY ("userid") REFERENCES "users"("id");

ALTER TABLE "carts_products" ADD CONSTRAINT "carts_products_uk0" UNIQUE ("cart_userid", "productid");
ALTER TABLE "orders_products" ADD CONSTRAINT "orders_products_uk0" UNIQUE ("orderid", "productid");
