<?php
/*
 * Template Name: About Page
 * Description: An About Page Template with a History/Timeline section.
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
Timber::render( array( 'template-about.twig' ), $context );