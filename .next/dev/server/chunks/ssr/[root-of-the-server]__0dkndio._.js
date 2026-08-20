module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/Desktop/samtob/src/app/favicon.ico (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/favicon.2vob68tjqpejf.ico" + (globalThis["NEXT_CLIENT_ASSET_SUFFIX"] || ''));}),
"[project]/Desktop/samtob/src/app/favicon.ico.mjs { IMAGE => \"[project]/Desktop/samtob/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/app/favicon.ico (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 256,
    height: 256
};
}),
"[project]/Desktop/samtob/src/lib/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminClient",
    ()=>createAdminClient,
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/next/headers.js [app-rsc] (ecmascript)");
/**
 * Admin client — uses the service role key, bypasses Row Level Security entirely.
 * ONLY ever import this in server-side code (API routes), never in client components.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // Called from a Server Component (no response to write to) — safe to ignore
                // because the middleware below handles refreshing the session cookie.
                }
            }
        }
    });
}
;
function createAdminClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}
}),
"[project]/Desktop/samtob/src/lib/db.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "database",
    ()=>database
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/lib/supabase/server.ts [app-rsc] (ecmascript)");
;
;
// ---------- row <-> app-shape mappers ----------
function toProduct(r) {
    return {
        id: r.id,
        name: r.name,
        slug: r.slug,
        category: r.category,
        condition: r.condition,
        brand: r.brand,
        price: r.price,
        oldPrice: r.old_price,
        specs: r.specs || {},
        stock: r.stock,
        warrantyDays: r.warranty_days,
        description: r.description,
        images: r.images || [],
        featured: r.featured
    };
}
function fromProduct(p) {
    const row = {};
    if (p.name !== undefined) row.name = p.name;
    if (p.slug !== undefined) row.slug = p.slug;
    if (p.category !== undefined) row.category = p.category;
    if (p.condition !== undefined) row.condition = p.condition;
    if (p.brand !== undefined) row.brand = p.brand;
    if (p.price !== undefined) row.price = p.price;
    if (p.oldPrice !== undefined) row.old_price = p.oldPrice;
    if (p.specs !== undefined) row.specs = p.specs;
    if (p.stock !== undefined) row.stock = p.stock;
    if (p.warrantyDays !== undefined) row.warranty_days = p.warrantyDays;
    if (p.description !== undefined) row.description = p.description;
    if (p.images !== undefined) row.images = p.images;
    if (p.featured !== undefined) row.featured = p.featured;
    return row;
}
function toOrder(r) {
    return {
        id: r.id,
        orderNumber: r.order_number,
        userId: r.user_id,
        customerName: r.customer_name,
        phone: r.phone,
        email: r.email,
        address: r.address,
        region: r.region,
        deliveryMethod: r.delivery_method,
        deliveryFee: r.delivery_fee,
        items: r.items,
        subtotal: r.subtotal,
        total: r.total,
        paymentMethod: r.payment_method,
        paymentStatus: r.payment_status,
        bankReference: r.bank_reference,
        klumpReference: r.klump_reference,
        status: r.status,
        createdAt: r.created_at
    };
}
function toPlan(r) {
    return {
        id: r.id,
        userId: r.user_id,
        productId: r.product_id,
        productName: r.product_name,
        productImage: r.product_image,
        targetAmount: r.target_amount,
        savedAmount: r.saved_amount,
        frequency: r.frequency,
        installmentAmount: r.installment_amount,
        status: r.status,
        createdAt: r.created_at
    };
}
function toContribution(r) {
    return {
        id: r.id,
        planId: r.plan_id,
        amount: r.amount,
        bankReference: r.bank_reference,
        status: r.status,
        createdAt: r.created_at,
        confirmedAt: r.confirmed_at
    };
}
const database = {
    async getProducts (client) {
        const supabase = client || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("products").select("*").order("created_at");
        if (error) throw error;
        return (data || []).map(toProduct);
    },
    async getProductBySlug (slug, client) {
        const supabase = client || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
        return data ? toProduct(data) : undefined;
    },
    async getProductById (id, client) {
        const supabase = client || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
        return data ? toProduct(data) : undefined;
    },
    async saveProduct (product, client) {
        const row = fromProduct(product);
        if (product.id) {
            const { data, error } = await client.from("products").update(row).eq("id", product.id).select().single();
            if (error) throw error;
            return toProduct(data);
        }
        const { data, error } = await client.from("products").insert(row).select().single();
        if (error) throw error;
        return toProduct(data);
    },
    async deleteProduct (id, client) {
        const { error } = await client.from("products").delete().eq("id", id);
        if (error) throw error;
    },
    async decrementStock (items, client) {
        for (const item of items){
            const { data } = await client.from("products").select("stock").eq("id", item.productId).single();
            if (data) {
                await client.from("products").update({
                    stock: Math.max(0, data.stock - item.qty)
                }).eq("id", item.productId);
            }
        }
    },
    async getOrders (client) {
        const { data, error } = await client.from("orders").select("*").order("created_at", {
            ascending: false
        });
        if (error) throw error;
        return (data || []).map(toOrder);
    },
    async getOrdersForUser (userId, client) {
        const supabase = client || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("orders").select("*").eq("user_id", userId).order("created_at", {
            ascending: false
        });
        if (error) throw error;
        return (data || []).map(toOrder);
    },
    async getOrderById (id, client) {
        const supabase = client || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
        return data ? toOrder(data) : undefined;
    },
    async createOrder (order, client) {
        const { data, error } = await client.from("orders").insert({
            order_number: order.orderNumber,
            user_id: order.userId,
            customer_name: order.customerName,
            phone: order.phone,
            email: order.email,
            address: order.address,
            region: order.region,
            delivery_method: order.deliveryMethod,
            delivery_fee: order.deliveryFee,
            items: order.items,
            subtotal: order.subtotal,
            total: order.total,
            payment_method: order.paymentMethod,
            bank_reference: order.bankReference || null
        }).select().single();
        if (error) throw error;
        await database.decrementStock(order.items, client);
        return toOrder(data);
    },
    async updateOrder (id, fields, client) {
        const row = {};
        if (fields.status !== undefined) row.status = fields.status;
        if (fields.paymentStatus !== undefined) row.payment_status = fields.paymentStatus;
        if (fields.klumpReference !== undefined) row.klump_reference = fields.klumpReference;
        const { data, error } = await client.from("orders").update(row).eq("id", id).select().single();
        if (error) throw error;
        return toOrder(data);
    },
    async getReviews (client) {
        const supabase = client || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("reviews").select("*").order("created_at");
        if (error) throw error;
        return data || [];
    },
    // ---- Save-to-Buy ----
    async getPlansForUser (userId, client) {
        const supabase = client || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("save_to_buy_plans").select("*").eq("user_id", userId).order("created_at", {
            ascending: false
        });
        if (error) throw error;
        return (data || []).map(toPlan);
    },
    async getAllPlans (client) {
        const { data, error } = await client.from("save_to_buy_plans").select("*").order("created_at", {
            ascending: false
        });
        if (error) throw error;
        return (data || []).map(toPlan);
    },
    async createPlan (plan, client) {
        const supabase = client || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("save_to_buy_plans").insert({
            user_id: plan.userId,
            product_id: plan.productId,
            product_name: plan.productName,
            product_image: plan.productImage,
            target_amount: plan.targetAmount,
            frequency: plan.frequency,
            installment_amount: plan.installmentAmount
        }).select().single();
        if (error) throw error;
        return toPlan(data);
    },
    async getContributionsForPlan (planId, client) {
        const supabase = client || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("save_to_buy_contributions").select("*").eq("plan_id", planId).order("created_at", {
            ascending: false
        });
        if (error) throw error;
        return (data || []).map(toContribution);
    },
    async getAllPendingContributions (client) {
        const { data, error } = await client.from("save_to_buy_contributions").select("*, save_to_buy_plans(*)").order("created_at", {
            ascending: false
        });
        if (error) throw error;
        return (data || []).map((r)=>({
                ...toContribution(r),
                plan: toPlan(r.save_to_buy_plans)
            }));
    },
    async createContribution (contribution, client) {
        const supabase = client || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("save_to_buy_contributions").insert({
            plan_id: contribution.planId,
            amount: contribution.amount,
            bank_reference: contribution.bankReference
        }).select().single();
        if (error) throw error;
        return toContribution(data);
    },
    async updateContributionStatus (id, status, client) {
        const { data, error } = await client.from("save_to_buy_contributions").update({
            status
        }).eq("id", id).select().single();
        if (error) throw error;
        return toContribution(data);
    }
};
}),
"[project]/Desktop/samtob/src/components/ProductCard.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/Desktop/samtob/src/components/ProductCard.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/samtob/src/components/ProductCard.tsx <module evaluation>", "default");
}),
"[project]/Desktop/samtob/src/components/ProductCard.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/Desktop/samtob/src/components/ProductCard.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/samtob/src/components/ProductCard.tsx", "default");
}),
"[project]/Desktop/samtob/src/components/ProductCard.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/components/ProductCard.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/components/ProductCard.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/Desktop/samtob/src/components/home/Hero.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/Desktop/samtob/src/components/home/Hero.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/samtob/src/components/home/Hero.tsx <module evaluation>", "default");
}),
"[project]/Desktop/samtob/src/components/home/Hero.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/Desktop/samtob/src/components/home/Hero.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/samtob/src/components/home/Hero.tsx", "default");
}),
"[project]/Desktop/samtob/src/components/home/Hero.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$home$2f$Hero$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/components/home/Hero.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$home$2f$Hero$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/components/home/Hero.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$home$2f$Hero$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/Desktop/samtob/src/components/home/BrandMarquee.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/Desktop/samtob/src/components/home/BrandMarquee.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/samtob/src/components/home/BrandMarquee.tsx <module evaluation>", "default");
}),
"[project]/Desktop/samtob/src/components/home/BrandMarquee.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/Desktop/samtob/src/components/home/BrandMarquee.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/samtob/src/components/home/BrandMarquee.tsx", "default");
}),
"[project]/Desktop/samtob/src/components/home/BrandMarquee.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$home$2f$BrandMarquee$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/components/home/BrandMarquee.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$home$2f$BrandMarquee$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/components/home/BrandMarquee.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$home$2f$BrandMarquee$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/Desktop/samtob/src/components/motion/StaggerGrid.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StaggerGrid",
    ()=>StaggerGrid,
    "StaggerItem",
    ()=>StaggerItem
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const StaggerGrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call StaggerGrid() from the server but StaggerGrid is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/samtob/src/components/motion/StaggerGrid.tsx <module evaluation>", "StaggerGrid");
const StaggerItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call StaggerItem() from the server but StaggerItem is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/samtob/src/components/motion/StaggerGrid.tsx <module evaluation>", "StaggerItem");
}),
"[project]/Desktop/samtob/src/components/motion/StaggerGrid.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StaggerGrid",
    ()=>StaggerGrid,
    "StaggerItem",
    ()=>StaggerItem
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const StaggerGrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call StaggerGrid() from the server but StaggerGrid is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/samtob/src/components/motion/StaggerGrid.tsx", "StaggerGrid");
const StaggerItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call StaggerItem() from the server but StaggerItem is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/samtob/src/components/motion/StaggerGrid.tsx", "StaggerItem");
}),
"[project]/Desktop/samtob/src/components/motion/StaggerGrid.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$StaggerGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/components/motion/StaggerGrid.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$StaggerGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/components/motion/StaggerGrid.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$StaggerGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/Desktop/samtob/src/components/motion/AnimatedCounter.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/Desktop/samtob/src/components/motion/AnimatedCounter.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/samtob/src/components/motion/AnimatedCounter.tsx <module evaluation>", "default");
}),
"[project]/Desktop/samtob/src/components/motion/AnimatedCounter.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/Desktop/samtob/src/components/motion/AnimatedCounter.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/samtob/src/components/motion/AnimatedCounter.tsx", "default");
}),
"[project]/Desktop/samtob/src/components/motion/AnimatedCounter.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$AnimatedCounter$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/components/motion/AnimatedCounter.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$AnimatedCounter$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/components/motion/AnimatedCounter.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$AnimatedCounter$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/Desktop/samtob/src/app/(site)/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-rsc] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [app-rsc] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/lucide-react/dist/esm/icons/truck.mjs [app-rsc] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/lucide-react/dist/esm/icons/repeat.mjs [app-rsc] (ecmascript) <export default as Repeat>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__ = __turbopack_context__.i("[project]/Desktop/samtob/node_modules/lucide-react/dist/esm/icons/wrench.mjs [app-rsc] (ecmascript) <export default as Wrench>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/lib/db.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/components/ProductCard.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$home$2f$Hero$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/components/home/Hero.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$home$2f$BrandMarquee$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/components/home/BrandMarquee.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$Reveal$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/components/motion/Reveal.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$StaggerGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/components/motion/StaggerGrid.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$AnimatedCounter$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/samtob/src/components/motion/AnimatedCounter.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
const dynamic = "force-dynamic";
async function Home() {
    const products = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["database"].getProducts();
    const featured = products.filter((p)=>p.featured).slice(0, 8);
    const reviews = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["database"].getReviews();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$home$2f$Hero$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$home$2f$BrandMarquee$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "border-b border-line bg-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center",
                    children: [
                        {
                            value: 3,
                            suffix: "",
                            label: "Physical Stores"
                        },
                        {
                            value: products.length,
                            suffix: "+",
                            label: "Devices in stock"
                        },
                        {
                            value: 1,
                            suffix: "yr",
                            label: "Warranty on new"
                        },
                        {
                            value: 100,
                            suffix: "%",
                            label: "Tested before sale"
                        }
                    ].map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$Reveal$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            delay: i * 0.06,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-display font-bold text-3xl",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$AnimatedCounter$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                        value: s.value,
                                        suffix: s.suffix
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                        lineNumber: 34,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                    lineNumber: 33,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-steel mt-1 font-data uppercase tracking-wider",
                                    children: s.label
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                    lineNumber: 36,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, s.label, true, {
                            fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                            lineNumber: 32,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$StaggerGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StaggerGrid"], {
                    className: "grid grid-cols-3 gap-5",
                    children: [
                        {
                            label: "Laptops",
                            href: "/products?category=laptops",
                            desc: "New &amp; UK used, all specs"
                        },
                        {
                            label: "Phones",
                            href: "/products?category=phones",
                            desc: "iPhone, Samsung &amp; more"
                        },
                        {
                            label: "Gadgets",
                            href: "/products?category=gadgets",
                            desc: "Watches, speakers, accessories"
                        }
                    ].map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$StaggerGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StaggerItem"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                href: c.href,
                                className: "group block rounded-2xl border border-line bg-white p-7 hover:border-signal/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-data uppercase tracking-widest text-steel",
                                        children: "Category"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                        lineNumber: 55,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-display font-bold text-2xl mt-2 group-hover:text-signal transition-colors",
                                        children: c.label
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                        lineNumber: 56,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-steel mt-1",
                                        dangerouslySetInnerHTML: {
                                            __html: c.desc
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                        lineNumber: 59,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-flex items-center gap-1 text-sm font-medium mt-4 text-signal",
                                        children: [
                                            "Browse",
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                size: 14,
                                                className: "group-hover:translate-x-1 transition-transform"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                                lineNumber: 62,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                        lineNumber: 60,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                lineNumber: 51,
                                columnNumber: 15
                            }, this)
                        }, c.href, false, {
                            fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                            lineNumber: 50,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$Reveal$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        className: "flex items-end justify-between mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-data uppercase tracking-widest text-signal",
                                        children: "On the shelf"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                        lineNumber: 74,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "font-display font-bold text-3xl mt-1",
                                        children: "Featured devices"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                        lineNumber: 75,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                lineNumber: 73,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                href: "/products",
                                className: "text-sm font-medium text-signal hover:underline hidden sm:inline",
                                children: "View all products →"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$StaggerGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StaggerGrid"], {
                        className: "grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6",
                        children: featured.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$StaggerGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StaggerItem"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    product: p
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                    lineNumber: 84,
                                    columnNumber: 15
                                }, this)
                            }, p.id, false, {
                                fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                lineNumber: 83,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$StaggerGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StaggerGrid"], {
                    className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-8",
                    children: [
                        {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"],
                            title: "Warranty on every device",
                            desc: "1yr on new, 30-day guaranty on UK used."
                        },
                        {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"],
                            title: "Nationwide delivery",
                            desc: "Free delivery on qualifying orders — shipped anywhere in Nigeria."
                        },
                        {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__["Repeat"],
                            title: "Trade-in accepted",
                            desc: "Swap your old SAMTOB device for a new one."
                        },
                        {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"],
                            title: "Professional repairs",
                            desc: "Affordable, expert repair services in-store."
                        }
                    ].map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$StaggerGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StaggerItem"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-11 h-11 rounded-full bg-signal/10 flex items-center justify-center mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(f.icon, {
                                        size: 20,
                                        className: "text-signal"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                        lineNumber: 101,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                    lineNumber: 100,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-display font-semibold text-base",
                                    children: f.title
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                    lineNumber: 103,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-steel mt-1.5 leading-relaxed",
                                    children: f.desc
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                    lineNumber: 104,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, f.title, true, {
                            fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                            lineNumber: 99,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-ink text-paper py-20 relative overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$Reveal$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            className: "flex items-end justify-between mb-10",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-data uppercase tracking-widest text-signal-bright",
                                        children: "Customer signal"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                        lineNumber: 115,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "font-display font-bold text-3xl mt-1",
                                        children: "What buyers are saying"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                        lineNumber: 116,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                            lineNumber: 113,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$StaggerGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StaggerGrid"], {
                            className: "grid sm:grid-cols-3 gap-6",
                            children: reviews.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$StaggerGrid$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StaggerItem"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-2xl border border-paper/10 p-6 h-full hover:border-signal/40 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-data text-signal-bright text-sm mb-3",
                                                children: "★".repeat(r.rating)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                                lineNumber: 123,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-paper/80 leading-relaxed",
                                                children: r.text
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                                lineNumber: 124,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-paper/50 mt-4 font-data",
                                                children: [
                                                    "— ",
                                                    r.name
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                                lineNumber: 125,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                        lineNumber: 122,
                                        columnNumber: 17
                                    }, this)
                                }, r.id, false, {
                                    fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                    lineNumber: 121,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                            lineNumber: 119,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$Reveal$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            delay: 0.2,
                            className: "mt-10 flex flex-wrap gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "https://g.page/r/CXNGNI_XwjLiEBM/review",
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "text-sm underline text-paper/70 hover:text-signal-bright",
                                    children: "Leave a Google review"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                    lineNumber: 131,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-paper/30",
                                    children: "·"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                    lineNumber: 132,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "https://jiji.ng/create-opinion/user437607",
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "text-sm underline text-paper/70 hover:text-signal-bright",
                                    children: "Leave a Jiji review"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                    lineNumber: 133,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                            lineNumber: 130,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                    lineNumber: 112,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$src$2f$components$2f$motion$2f$Reveal$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "font-display font-bold text-3xl sm:text-4xl max-w-xl mx-auto",
                            children: "Have a question before you buy?"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                            lineNumber: 141,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-steel mt-3",
                            children: "Our team replies fast on WhatsApp, or visit one of our stores."
                        }, void 0, false, {
                            fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                            lineNumber: 144,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-7 flex flex-wrap justify-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/faq",
                                    className: "inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 rounded-full font-medium text-sm hover:bg-signal transition-colors",
                                    children: "Read FAQ"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                    lineNumber: 146,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$samtob$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/stores",
                                    className: "inline-flex items-center gap-2 border border-ink/20 px-6 py-3.5 rounded-full font-medium text-sm hover:border-signal hover:text-signal transition-colors",
                                    children: "Find a store"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                                    lineNumber: 149,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                            lineNumber: 145,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                    lineNumber: 140,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/samtob/src/app/(site)/page.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/Desktop/samtob/src/app/(site)/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Desktop/samtob/src/app/(site)/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0dkndio._.js.map