<?php
/*
 * Template Name: Product Request
 * Description: A product request Page Template with a custom order form.
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
Timber::render( array( 'template-product-request.twig' ), $context );