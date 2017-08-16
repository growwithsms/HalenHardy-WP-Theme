<?php
/*
 * Template Name: Contact Page
 * Description: A Contact Page Template with a 2 column layout.
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
Timber::render( array( 'template-contact.twig' ), $context );